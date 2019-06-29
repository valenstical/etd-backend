import express from 'express';
import { handleValidation, Validator, validatePagination } from '../middleware/validator';
import * as schoolValidator from '../middleware/schoolValidator';
import SchoolController from '../controllers/schoolController';
import MemberValidator from '../middleware/memberValidator';

const router = express.Router();

// Create school with basic details
router.post(
  '/',
  Validator.validateToken,
  schoolValidator.validateBasicDetails,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolDuplicate,
  SchoolController.createSchool,
);

// update school basic details
router.patch(
  '/:schoolId',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateBasicDetails,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school full details
router.patch(
  '/:schoolId/details',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateFullDetails,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school status
router.patch(
  '/:schoolId/status',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateIsActive,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school cover image
router.patch(
  '/:schoolId/cover',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateCoverImage,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school cover image
router.patch(
  '/:schoolId/logo',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateLogoImage,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school cover image
router.patch(
  '/:schoolId/gallery',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateGallery,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  SchoolController.updateSchool,
);

// update school contact details
router.patch(
  '/:schoolId/contact',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateContactDetails,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  schoolValidator.contactToJSON,
  SchoolController.updateSchool,
);

// update school location
router.patch(
  '/:schoolId/location',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateLocationDetails,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  schoolValidator.locationToJSON,
  SchoolController.updateSchool,
);

// update school amenities
router.patch(
  '/:schoolId/amenities',
  Validator.validateToken,
  schoolValidator.validateSchoolId,
  schoolValidator.validateAmenities,
  handleValidation,
  MemberValidator.validateMemberStatus,
  schoolValidator.validateSchoolExists,
  schoolValidator.amenitiesToJSON,
  SchoolController.updateSchool,
);

// get single school
router.get(
  '/:schoolId',
  schoolValidator.validateSchoolId,
  handleValidation,
  SchoolController.getSchool,
);

// get multiple schools
router.get('/', validatePagination, SchoolController.getSchools);
export default router;
