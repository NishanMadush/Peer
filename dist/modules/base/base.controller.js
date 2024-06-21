import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import * as countryService from '../country/country.service';
import * as userService from '../user/user.service';
import * as languageService from '../language/language.service';
import * as organizationService from '../organization/organization.service';
export const _getUserActivityLog = catchAsync(async (req, res) => {
    const activities = [
        {
            "id": "1",
            "actor": "You",
            "code": "eventAdded",
            "createdAt": 1617868226000,
            "params": {
                "resource": "React Summit"
            }
        },
        {
            "id": "2",
            "actor": "John Smith",
            "code": "eventUpdated",
            "createdAt": 1617868226000,
            "params": {
                "resource": "React Summit"
            }
        },
        {
            "id": "3",
            "actor": "John Smith",
            "code": "userDeleted",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        },
        {
            "id": "4",
            "actor": "John Smith",
            "code": "userUpdated",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        },
        {
            "id": "5",
            "actor": "John Smith",
            "code": "userAdded",
            "createdAt": 1617868226000,
            "params": {
                "resource": "John Smith"
            }
        }
    ];
    res.status(httpStatus.OK).send(activities);
    // res.send(activities)
});
export const _notifications = catchAsync(async (req, res) => {
    const notifications = [
        {
            "id": "1",
            "code": "unreadMessages",
            "createdAt": 1617868226000,
            "params": {
                "quantity": "5"
            },
            "unread": true
        },
        {
            "id": "2",
            "code": "newComment",
            "createdAt": 1617868226000,
            "params": {
                "user": "John Smith"
            },
            "unread": false
        }
    ];
    res.status(httpStatus.OK).send(notifications);
});
export const userSettings = catchAsync(async (req, res) => {
    let roles, countries, languages, organizations;
    // Roles
    try {
        roles = await userService.queryRoles({}, { 'projectBy': 'role, id' });
    }
    catch (error) {
        console.log('~!@# error getting roles ', error);
    }
    try {
        countries = await countryService.queryCountries({}, { 'projectBy': 'name' });
    }
    catch (error) {
        console.log('~!@# error getting roles ', error);
    }
    try {
        languages = await languageService.queryLanguages({}, { 'projectBy': 'name' });
    }
    catch (error) {
        console.log('~!@# error getting roles ', error);
    }
    try {
        organizations = await organizationService.queryOrganizations({}, { 'projectBy': 'countryId, name, departments, designations, branches._id, branches.branchName' });
    }
    catch (error) {
        console.log('~!@# error getting roles ', error);
    }
    const salutations = ['Mr', 'Mrs', 'Ms', 'Dr', 'Hons', 'Rev', 'Other'];
    const settings = {
        roles: roles?.results ?? [],
        countries: countries?.results ?? [],
        languages: languages?.results ?? [],
        organizations: organizations?.results ?? [],
        salutation: salutations
    };
    res.status(httpStatus.OK).send(settings);
});
//# sourceMappingURL=base.controller.js.map