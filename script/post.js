module.exports.config = {
  name: "post",
  version: "1.0.0",
  role: 1,
  credits: "NTKhang",
  description: "Create a new post in acc bot.",
  commandCategory: "Tiện ích",
  cooldowns: 5,
  hasPrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const uuid = getGUID();
  const formData = {
    "input": {
      "composer_entry_point": "inline_composer",
      "composer_source_surface": "timeline",
      "idempotence_token": uuid + "_FEED",
      "source": "WWW",
      "attachments": [],
      "audience": {
        "privacy": {
          "allow": [],
          "base_state": "FRIENDS", // SELF EVERYONE
          "deny": [],
          "tag_expansion_state": "UNSPECIFIED"
        }
      },
      "message": {
        "ranges": [],
        "text": ""
      },
      "with_tags_ids": [],
      "inline_activities": [],
      "explicit_place_id": "0",
      "text_format_preset_id": "0",
      "logging": {
        "composer_session_id": uuid
      },
      "tracking": [
        null
      ],
      "actor_id": api.getCurrentUserID(),
      "client_mutation_id": Math.floor(Math.random()*17)
    },
    "displayCommentsFeedbackContext": null,
    "displayCommentsContextEnableComment": null,
    "displayCommentsContextIsAdPreview": null,
    "displayCommentsContextIsAggregatedShare": null,
    "displayCommentsContextIsStorySet": null,
    "feedLocation": "TIMELINE",
    "feedbackSource": 0,
    "focusCommentID": null,
    "gridMediaWidth": 230,
    "groupID": null,
    "scale": 3,
    "privacySelectorRenderLocation": "COMET_STREAM",
    "renderLocation": "timeline",
    "useDefaultActor": false,
    "inviteShortLinkKey": null,
    "isFeed": false,
    "isFundraiser": false,
    "isFunFactPost": false,
    "isGroup": false,
    "isTimeline": true,
    "isSocialLearning": false,
    "isPageNewsFeed": false,
    "isProfileReviews": false,
    "isWorkSharedDraft": false,
    "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
    "hashtag": null,
    "canUserManageOffers": false
  };

  const audienceOptions = {
    "1": "EVERYONE",
    "2": "FRIENDS",
    "3": "SELF"
  };

  const audienceChoice = args[0];
  const content = args.slice(1).join(" ");

  if (!audienceOptions[audienceChoice]) {
    return api.sendMessage("Invalid audience choice. Please choose 1, 2, or 3.", threadID, messageID);
  }

  formData.input.audience.privacy.base_state = audienceOptions[audienceChoice];
  formData.input.message.text = content;

  try {
    const postResult = await createPost(api, formData);
    return api.sendMessage(`Post created successfully:\nPost ID: ${postResult.postID}\nPost URL: ${postResult.postURL}`, threadID, messageID);
  } catch (error) {
    console.error("Error creating post:", error);
    return api.sendMessage("Failed to create post. Please try again later.", threadID, messageID);
  }
};

async function createPost(api, formData) {
  return new Promise((resolve, reject) => {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "7711610262190099",
      variables: JSON.stringify(formData)
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (error, result) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseData = JSON.parse(result.replace("for (;;);", ""));
          const postID = responseData.data.story_create.story.legacy_story_hideable_id;
          const postURL = responseData.data.story_create.story.url;
          resolve({ postID, postURL });
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
