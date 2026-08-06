const { z } = require('zod');

const createRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  category: z.enum([
    'Operations',
    'Refund & Returns',
    'Supply Chain',
    'Procurement',
    'Fraud & Risk',
    'Customer Support',
    'Compliance'
  ]).optional().default('Operations'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional().default('Medium'),
  metadata: z.record(z.any()).optional().default({})
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for business request',
        errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

module.exports = {
  validateCreateRequest: validate(createRequestSchema)
};
