export var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["Pending"] = "Pending";
    UserStatusEnum["Incomplete"] = "Incomplete";
    UserStatusEnum["Active"] = "Active";
    UserStatusEnum["Disabled"] = "Disabled";
    UserStatusEnum["Deleted"] = "Deleted";
})(UserStatusEnum || (UserStatusEnum = {}));
export var GenderEnum;
(function (GenderEnum) {
    GenderEnum["Male"] = "Male";
    GenderEnum["Female"] = "Female";
    GenderEnum["Other"] = "Other";
})(GenderEnum || (GenderEnum = {}));
// Note: Hardcoded enum values are used in auth-middleware and login
export var PermissionTypeEnum;
(function (PermissionTypeEnum) {
    PermissionTypeEnum["FE"] = "FrontEnd";
    PermissionTypeEnum["BE"] = "BackEnd";
})(PermissionTypeEnum || (PermissionTypeEnum = {}));
//# sourceMappingURL=user.js.map