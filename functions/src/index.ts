import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {CallableContext, HttpsError} from 'firebase-functions/lib/providers/https';
import {UserRecord} from 'firebase-functions/lib/providers/auth';
import ListUsersResult = admin.auth.ListUsersResult;

admin.initializeApp();

/**
 * Role of the user
 */
export enum Claim {
    DEV = 'DEV',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    DESIGNER = 'DESIGNER'
}

export const claimEnumToBoolean = (claim: Claim) => {
    switch (claim) {
        case Claim.DEV:
            return {DEV: true};
            break;
        case Claim.ADMIN:
            return {ADMIN: true};
            break;
        case Claim.MODERATOR:
            return {MODERATOR: true};
            break;
        case Claim.DESIGNER:
            return {DESIGNER: true};
            break;
    }
};

// @ts-ignore
export const claimBooleanToEnum = (user: any | UserRecord) => {
    if (user.customClaims.DEV === true) {
        return Claim.DEV;
    }
    if (user.customClaims.ADMIN === true) {
        return Claim.ADMIN;
    }
    if (user.customClaims.MODERATOR === true) {
        return Claim.DESIGNER;
    }
    if (user.customClaims.DESIGNER === true) {
        return Claim.DESIGNER;
    }
};

/**
 * Helper to set claim to user
 * @param email: string
 * @param claim: Claim
 */
export const makeClaim = async (email: string, claim: Claim) => {
    const user = await admin.auth().getUserByEmail(email);
    const customClaim = {};
    // @ts-ignore
    customClaim[claim] = true;
    return admin.auth().setCustomUserClaims(user.uid, customClaim);
};

/**
 * Helper to set claim to user
 * @param email: string
 * @param claim: Claim
 */
export const makeClaimToUser = async (user: any | UserRecord) => {
    try {
        return admin.auth().setCustomUserClaims(user.uid, user.customClaims);
    } catch (e) {
        throw new HttpsError('cancelled', e.message);
    }

};

/**
 * Make an User have Claim DEV
 * Executed by anyone
 * Must be deleted in Production
 */
export const makeDev = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        await makeClaim(data.email, Claim.DEV);
        return `User ${data.email} has been claimed DEV`;
    } catch (e) {
        console.log(e);
        throw e;
    }
});

/**
 * Make an User have Claim ADMIN
 * Executed by DEV
 */
export const makeAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true) {
            await makeClaim(data.email, Claim.ADMIN);
            return `User ${data.email} has been claimed ADMIN`;
        } else if (context.auth) {
            const currentUser = await admin.auth().getUser(context.auth?.uid);
            throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
        } else {
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Make an User have Claim MODERATOR
 * Executed by Admin or Dev
 */
export const makeModerator = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            await makeClaim(data.email, Claim.MODERATOR);
            return `User ${data.email} has been claimed MODERATOR`;
        } else if (context.auth) {
            const currentUser = await admin.auth().getUser(context.auth?.uid);
            throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
        } else {
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Make an User have Claim DESIGNER
 * Executed by Admin or Dev
 */
export const makeDesigner = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            await makeClaim(data.email, Claim.DESIGNER);
            return `User ${data.email} has been claimed DESIGNER`;
        } else if (context.auth) {
            const currentUser = await admin.auth().getUser(context.auth?.uid);
            throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
        } else {
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Create a new User
 * Executed by Admin or Dev
 */
export const createUser = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        const user = data.user;
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            const userRecord: UserRecord = await admin.auth().createUser({
                displayName: user.displayName,
                email: user.email,
                password: user.password,
            });

            user.uid = userRecord.uid;
            await makeClaimToUser(user);

            const toCreateUserDoc = {
                customClaims: user.customClaims,
                displayName: user.displayName,
                email: user.email,
            };
            const docRef = await admin.firestore().doc(`users/${user.uid}`).create(toCreateUserDoc);
            console.log(docRef);
            return `User ${userRecord.email} with Claim ${claimBooleanToEnum(user.customClaims)} has been created...`;
        } else {
            if (context.auth) {
                const currentUser = await admin.auth().getUser(context.auth?.uid);
                throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
            }
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Update another User's Password
 * Executed by Admin or Dev
 */
export const updateUserByAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        const user = data.user;
        if (context.auth?.token.DEV === true || (context.auth?.token.ADMIN === true && user.customClaims.DEV === undefined)) {
            const updatedUser: UserRecord = await admin.auth().updateUser(user.uid, {
                displayName: user.displayName,
                email: user.email,
                password: user.password
            });
            console.log(updatedUser);

            await makeClaimToUser(user);

            const toCreateUserDoc = {
                customClaims: user.customClaims,
                displayName: user.displayName,
                email: user.email,
            };
            const docRef = await admin.firestore().doc(`users/${user.uid}`).update(toCreateUserDoc);
            console.log(docRef);
            return `User ${user.email} has been updated successfully`;
        } else {
            if (context.auth) {
                const currentUser = await admin.auth().getUser(context.auth?.uid);
                throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
            }
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Update another User's Password
 * Executed by Admin or Dev
 */
export const updatePasswordByAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            const toUpdateUser = await admin.auth().getUserByEmail(data.email);
            const updatedUser: UserRecord = await admin.auth().updateUser(toUpdateUser.uid, {
                password: data.password
            });
            console.log(updatedUser);
            return `Password for User ${toUpdateUser.email} has been updated successfully`;
        } else {
            if (context.auth) {
                const currentUser = await admin.auth().getUser(context.auth?.uid);
                throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
            }
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Update another User's Email
 * Executed by Admin or Dev
 */
export const updateEmailByAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            const toUpdateUser: UserRecord = await admin.auth().getUserByEmail(data.email);
            const updatedUser: UserRecord = await admin.auth().updateUser(toUpdateUser.uid, {
                email: data.newEmail
            });
            console.log(updatedUser);

            // Update the user in Firestore because there's no trigger onUpdateUser available
            await admin.firestore().doc(`users/${updatedUser.uid}`).set({email: data.newEmail});
            return `New Email for User ${toUpdateUser.email} has been updated successfully to ${updatedUser.email}`;
        } else {
            if (context.auth) {
                const currentUser = await admin.auth().getUser(context.auth?.uid);
                throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
            }
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Get All Users from Authentication
 * Executed by Admin or Dev
 */
export const getAllUsersByAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true) {
            const listUsersResult: ListUsersResult = await admin.auth().listUsers();
            console.log(listUsersResult.users);
            return listUsersResult.users;
        } else {
            if (context.auth?.token.ADMIN === true) {
                const listUsersResult: ListUsersResult = await admin.auth().listUsers();
                // @ts-ignore
                listUsersResult.users = listUsersResult.users.filter(user => user.customClaims.DEV === undefined);
                console.log(listUsersResult.users);
                return listUsersResult.users;
            } else {
                if (context.auth) {
                    const currentUser = await admin.auth().getUser(context.auth?.uid);
                    throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
                }
                throw new HttpsError('unauthenticated', `Unauthorised access`);
            }
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Get one User from Authentication
 */
export const getUserById = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            const userRecord: UserRecord = await admin.auth().getUser(data.userId);
            return userRecord;
        } else {
            if (context.auth) {
                if (context.auth.token.uid === data.userId) {
                    const userRecord: UserRecord = await admin.auth().getUser(data.userId);
                    return userRecord;
                } else {
                    throw new HttpsError('unauthenticated', `Unauthorised access`);
                }
            }
            throw new HttpsError('permission-denied', `User doesn't have claim DEV or ADMIN`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Delete User from Authentication
 * Executed by Admin or Dev
 */
export const deleteUserByAdmin = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.DEV === true || context.auth?.token.ADMIN === true) {
            const user = await admin.auth().getUserByEmail(data.email);
            await admin.auth().deleteUser(user.uid);
            const message = `User ${user.email} has been deleted...`;
            console.log(message);
            return message;
        } else {
            if (context.auth) {
                const currentUser = await admin.auth().getUser(context.auth?.uid);
                throw new HttpsError('permission-denied', `${currentUser.email} doesn't have claim DEV or ADMIN`);
            }
            throw new HttpsError('unauthenticated', `Unauthorised access`);
        }
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Trigger when a new user being created
 */
// export const userOnCreate = functions.auth.user().onCreate(async (user: UserRecord, context: functions.EventContext) => {
//     try {
//         const toCreateUserDoc = {
//             customClaims: user.customClaims,
//             displayName: user.displayName,
//             email: user.email,
//             emailVerified: user.emailVerified,
//             photoURL: user.photoURL,
//         };
//
//         await admin.firestore().doc(`users/${user.uid}`).create(toCreateUserDoc);
//         const message = `User Document ${user.email} has been created`;
//         console.log(message);
//         return message;
//     } catch (e) {
//         console.log(e);
//         throw new HttpsError('invalid-argument', e.message);
//     }
// });

/**
 * Trigger when an user being deleted
 */
export const userOnDelete = functions.auth.user().onDelete(async (user: UserRecord, context: functions.EventContext) => {
    try {
        await admin.firestore().doc(`users/${user.uid}`).delete();
        const message = `User Document ${user.email} has been deleted`;
        console.log(message);
        return message;
    } catch (e) {
        console.log(e);
        throw new HttpsError('invalid-argument', e.message);
    }
});

/**
 * Boiler Code
 */
export const demo = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (context.auth?.token.admin === true) {
            console.log();
        }
    } catch (e) {
        console.log(e);
        return e;
    }
});
