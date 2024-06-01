// const roles = [
//     { roleName: 'Regular', roleId: 1, canView: true, canCreate: false, canEdit: false, canDelete: false },
//     { roleName: 'Moderator', roleId: 2, canView: true, canCreate: true, canEdit: true, canDelete: false },
//     { roleName: 'Admin', roleId: 3, canView: true, canCreate: true, canEdit: true, canDelete: true },
//     { roleName: 'Super Admin', roleId: 4, canView: true, canCreate: true, canEdit: true, canDelete: true },
//     { roleName: 'Owner', roleId: 5, canView: true, canCreate: true, canEdit: true, canDelete: true }
//   ];
  
//   // Save the roles to the database
//   const saveRoles = async () => {
//     try {
//       await Role.deleteMany({});
//       console.log('Roles collection cleared');
  
//       const savedRoles = await Role.insertMany(roles);
//       console.log('Roles saved:', savedRoles.map(role => role.roleName));
//       process.exit(0);
//     } catch (err) {
//       console.error(err);
//       process.exit(1);
//     }
//   };
//   saveRoles();