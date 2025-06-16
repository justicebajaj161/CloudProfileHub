const validators = {
  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
  validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Name validation
  validateName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  },

  // URL validation
  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Phone number validation (basic)
  validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // File type validation
  validateImageType(mimetype) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(mimetype);
  },

  // File size validation (in bytes)
  validateFileSize(size, maxSizeInMB = 5) {
    const maxSize = maxSizeInMB * 1024 * 1024;
    return size <= maxSize;
  },

  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  },

  // Validate user data for registration
  validateUserRegistration(userData) {
    const { name, email, password } = userData;
    const errors = [];

    if (!this.validateName(name)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    if (!this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!this.validatePassword(password)) {
      errors.push('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate user data for profile update
  validateUserUpdate(userData) {
    const { name, email, bio } = userData;
    const errors = [];

    if (name && !this.validateName(name)) {
      errors.push('Name must be between 2 and 50 characters');
    }

    if (email && !this.validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (bio && bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = validators;