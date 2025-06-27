package handlers

import (
	"encoding/json"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"time"
)

type CreateGroupRequest struct {
	Name        string `json:"title"`
	Description string `json:"description"`
}

func CreateGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var bodyRequest CreateGroupRequest

	err := json.NewDecoder(r.Body).Decode(&bodyRequest)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "invalid request body")
		return
	}

	err = tools.IsValidGroup(bodyRequest.Name, bodyRequest.Description)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	userId, _ := r.Context().Value("userID").(int)

	gorupId, err := models.Db.CreateGroup(bodyRequest.Name, bodyRequest.Description, userId)
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error: can't create new group, try again")
		return
	}

	_, err = models.Db.AddGroupMember(gorupId, userId, "creator")
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "internal server error: can't add you as a member")
		return
	}

	var groupResponse = models.Group{
		ID:          gorupId,
		Creator:     models.Creator{Id: userId},
		Title:       bodyRequest.Name,
		Description: bodyRequest.Description,
		CreatedAt:   time.Now().Format("Jan 2, 2006 at 3:04"),
	}

	tools.JSONResponse(w, 200, groupResponse)
}
