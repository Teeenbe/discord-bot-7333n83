const roles = [
  { reaction: "❗", roleName: "pingsquad" },
  { reaction: "cow_face", roleName: "barn life" },
];

function getRole(guild, reaction) {
  const role = roles.find((r) => r.reaction === reaction.emoji.name);
  if (role === undefined || role === null) {
    reaction.remove();
    return;
  }
  const guildRole = guild.roles.cache.find(
    (r) => r.name.toLowerCase() === role.roleName
  );
  return guildRole;
}

async function addRole(guild, user, reaction) {
  try {
    const role = await getRole(guild, reaction);
    if (role === undefined) {
      return;
    }
    user.roles.add(role);
  } catch (err) {
    console.error(err);
  }
}

async function removeRole(guild, user, reaction) {
  try {
    const role = await getRole(guild, reaction);
    if (role === undefined) {
      return;
    }
    user.roles.remove(role);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  addRole,
  removeRole,
};

// user reacts for role
// get role corresponding to reaction
// give/take role to/from user
