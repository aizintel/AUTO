// Import the usersList module
const usersList = require("../../database/commands/index");

module.exports = {
  config: {
    name: "users",
    description: "List all users in the current thread stored in the database.",
    usage: ":users",
    author: "Rui",
    version: "1.0.0",
    role: 1, // Assuming role 1 means admin, adjust as needed
  },
  run: async ({ api, event }) => {
    try {
      // Use the listUsers function to retrieve information about users in the current thread
      const usersInfo = await usersList.listUsers();

      if (usersInfo && usersInfo.length > 0) {
        const message = usersInfo
          .map((user) => `- User ID: ${user.userID}, Name: ${user.name}`)
          .join("\n");
        api.sendMessage(
          `[ DATABASE ] : List of Users in the Database:\n${message}`,
          event.threadID,
        );
      } else {
        api.sendMessage(
          "[ DATABASE ] : No users found in the database.",
          event.threadID,
        );
      }
    } catch (error) {
      console.error("Error in the users command:", error);
      api.sendMessage(
        "[ DATABASE ] : Error listing users from the database.",
        event.threadID,
      );
    }
  },
};
