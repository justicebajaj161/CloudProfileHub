const { s3 } = require('../config/aws');
const logger = require('./logger');

const s3Utils = {
  // Upload file to S3
  async uploadFile(file, key, bucket = process.env.S3_BUCKET_NAME) {
    try {
      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Metadata: {
          'original-name': file.originalname,
          'upload-time': new Date().toISOString()
        }
      };

      const result = await s3.upload(uploadParams).promise();
      logger.info(`File uploaded to S3: ${result.Location}`);
      
      return {
        success: true,
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket
      };
    } catch (error) {
      logger.error(`S3 upload failed: ${error.message}`);
      throw new Error('Failed to upload file to S3');
    }
  },

  // Delete file from S3
  async deleteFile(key, bucket = process.env.S3_BUCKET_NAME) {
    try {
      const deleteParams = {
        Bucket: bucket,
        Key: key
      };

      await s3.deleteObject(deleteParams).promise();
      logger.info(`File deleted from S3: ${key}`);
      
      return { success: true };
    } catch (error) {
      logger.error(`S3 delete failed: ${error.message}`);
      throw new Error('Failed to delete file from S3');
    }
  },

  // Generate signed URL for direct upload
  async getSignedUploadUrl(key, contentType, expiresIn = 300) {
    try {
      const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Expires: expiresIn,
        ACL: 'public-read'
      });

      const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        signedUrl,
        publicUrl,
        expiresIn
      };
    } catch (error) {
      logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new Error('Failed to generate upload URL');
    }
  },

  // Generate signed URL for file download
  async getSignedDownloadUrl(key, expiresIn = 3600) {
    try {
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: expiresIn
      });

      return signedUrl;
    } catch (error) {
      logger.error(`Failed to generate download URL: ${error.message}`);
      throw new Error('Failed to generate download URL');
    }
  },

  // List files in bucket
  async listFiles(prefix = '', maxKeys = 100) {
    try {
      const listParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys
      };

      const result = await s3.listObjectsV2(listParams).promise();
      
      return {
        files: result.Contents,
        count: result.KeyCount,
        truncated: result.IsTruncated
      };
    } catch (error) {
      logger.error(`Failed to list S3 files: ${error.message}`);
      throw new Error('Failed to list files');
    }
  },

  // Generate unique file key
  generateFileKey(userId, originalName, folder = 'uploads') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    
    return `${folder}/${userId}/${timestamp}-${randomString}.${extension}`;
  }
};

module.exports = s3Utils;