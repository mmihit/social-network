package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
)

type JoinGroupRequest struct {
	GroupId   int `json:"groupId"`
	CreatorId int `json:"creatorId"`
}

func SentJoinGroup(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("userID").(int)

	if r.Method != http.MethodPost {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var bodyRequest JoinGroupRequest

	err := json.NewDecoder(r.Body).Decode(&bodyRequest)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "error sending request, try again")
		return
	}

	creatorId, err := models.Db.GetGroupCreator(bodyRequest.GroupId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "something wrong, try again")
		return
	}

	if creatorId != bodyRequest.CreatorId {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "invalid creatorId, try again")
		return
	}

	status, err := models.Db.GetUserGroupStatus(bodyRequest.GroupId, userId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	switch status {
	case "creator", "member":
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you are already member on this group")
		return
	case "request":
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you are already sent a join request to this group")
		return
	}

	reqId, err := models.Db.AddGroupMember(bodyRequest.GroupId, userId, "request")
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	notification := models.Notification{
		RelatedId:  int(reqId),
		Type:       "group join request",
		SenderId:   userId,
		ReceiverId: creatorId,
	}

	_, err = models.Db.InsertNotification(&notification)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "can't sent notification")
		return
	}

	tools.JSONResponse(w, http.StatusOK, "join request sent succeffully")

}
