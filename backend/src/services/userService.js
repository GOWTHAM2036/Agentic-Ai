const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { supabase, memoryStore } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

async function registerUser({ name, email, password, role = 'manager' }) {
  // Check if email already exists
  let existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser && supabase) {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data) existingUser = data;
  }

  if (existingUser) {
    const err = new Error('User email already registered');
    err.statusCode = 400;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    password_hash,
    role,
    created_at: new Date().toISOString()
  };

  memoryStore.users.push(newUser);
  if (supabase) {
    try { await supabase.from('users').insert([newUser]); } catch (e) {}
  }

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    token
  };
}

async function loginUser({ email, password }) {
  let user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user && supabase) {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data) user = data;
  }

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  };
}

module.exports = {
  registerUser,
  loginUser
};
