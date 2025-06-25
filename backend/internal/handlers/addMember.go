package handlers

import (
	"encoding/json"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
)

type addMemberRequest struct {
	Id int `json:"id"`
}

type addMemberResponse struct {
	Message string `json:"message"`
}

func AddMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	groupId, err := strconv.Atoi(r.PathValue("groupID"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected group id")
		return
	}

	var requestBody addMemberRequest
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected user id")
		return
	}

	status, err := models.Db.GetUserGroupStatus(groupId, requestBody.Id)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	switch status {
	case "member", "creator":
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "this user already exist into this group")
		return
	case "request":
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you need to accept join request of this user from notifications")
		return
	default:
		senderId := r.Context().Value("userID").(int)

		status, err = models.Db.GetUserGroupStatus(groupId, senderId)
		if err != nil {
			tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
			return
		}

		if status != "member" && status != "creator" {
			tools.ErrorJSONResponse(w, http.StatusBadRequest, "you can't add this member")
			return
		}

		relatedId, err := models.Db.AddGroupMember(groupId, requestBody.Id, "member")
		if err != nil {
			tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
			return
		}

		var notif = models.Notification{
			RelatedId:  int(relatedId),
			Type:       "added to group",
			SenderId:   senderId,
			ReceiverId: requestBody.Id,
		}

		_, err = models.Db.InsertNotification(&notif)
		if err != nil {
			tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
			return
		}

		var response = addMemberResponse{
			Message: "this user added to the group",
		}

		tools.JSONResponse(w, http.StatusOK, response)
	}
}
