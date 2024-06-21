import express from 'express';
import { auth } from '../auth';
import { validate } from '../validate';
import { userController, userValidation } from '.';
const router = express.Router();
router
    .route('/')
    .options(userController.sendOptions)
    /**
     * Create a new user
     * @route POST /api/user
     * @security Bearer Token
     * @headers Accept-Language for translations
     * @returns 201 on created IUser
     * @returns 400 on incorrect parameters
     * @returns 401 on missing token
     * @returns 403 on missing permissions
     * @returns 500 on internal error or database error
     */
    .post(auth('MANAGE_USERS'), validate(userValidation.createUser), userController.createUser)
    /**
     * Get list of users
     * @route GET /api/user
     * @security Bearer Token
     * @headers Accept-Language for translations
     * @returns 200 on list of IUser
     * @returns 401 on missing token
     * @returns 403 on missing permissions
     * @returns 500 on internal error, database error or smtp error
     */
    .get(auth('GET_USERS'), validate(userValidation.getUsers), userController.getUsersWithCountry);
router
    .route('/:userId')
    .options(userController.sendOptions)
    /**
     * Get an user by id
     * @route GET /api/user/:userId
     * @security Bearer Token
     * @headers Accept-Language for translations
     * @returns 200 on IUser details
     * @returns 401 on missing token
     * @returns 403 on missing permissions
     * @returns 404 on user not found
     * @returns 500 on internal error, database error or smtp error
     */
    .get(auth('GET_USERS'), validate(userValidation.getUser), userController.getUser)
    .patch(auth('MANAGE_USERS'), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth('MANAGE_USERS'), validate(userValidation.deleteUser), userController.deleteUser);
// Manage profile for the user
router
    .route('/:userId/profile')
    .options(userController.sendOptions)
    .get(auth('MANAGE_PROFILE'), userController.getProfile)
    .patch(auth('MANAGE_PROFILE'), userController.updateProfile);
// Send email/sms notification to the user
router
    .route('/:userId/notify')
    .options(userController.sendOptions)
    .post(auth('MANAGE_USERS'), userController.notifyUser);
router
    .route('/auth/roles')
    .options(userController.sendOptions)
    .get(auth('MANAGE_ROLES'), userController.getRoles)
    .post(auth('MANAGE_ROLES'), userController.createRole);
router
    .route('/auth/roles/:role')
    .options(userController.sendOptions)
    .get(auth('MANAGE_ROLES'), userController.getPermissionsByRole)
    .patch(auth('MANAGE_ROLES'), userController.updateRole);
router
    .route('/auth/roles/:roleId')
    .options(userController.sendOptions)
    .delete(auth('MANAGE_ROLES'), userController.deleteRole);
router
    .route('/activity-logs')
    .get(userController._getUserActivityLog);
// router.get('/user-info', authController._loggedUserInformation)
// router.get('/profile-info', authController._loggedUserInformation)
export default router;
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [user, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: user
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all users
 *     description: Only admins can retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a user
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a user
 *     description: Logged in users can delete only themselves. Only admins can delete other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
//# sourceMappingURL=user.route.js.map