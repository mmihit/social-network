package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
)

func JoinInvitation(w http.ResponseWriter, r *http.Request) {
	// creatorId := r.Context().Value("userID")
	switch r.Method {
	case http.MethodPut, http.MethodDelete:
		var response struct {
			message string
		}
		var bodyRequest models.Notification
		err := json.NewDecoder(r.Body).Decode(&bodyRequest)
		if err != nil {
			fmt.Println(err)
			tools.ErrorJSONResponse(w, http.StatusBadRequest, "something wrong, please try again")
			return
		}

		err = models.Db.DeleteNotification(bodyRequest.Id, 0, 0)
		if err != nil {
			fmt.Println(err)
			tools.ErrorJSONResponse(w, http.StatusBadRequest, "something wrong, please try again")
		}

		if r.Method == http.MethodPut {
			response.message = "invitation approved"
			err = models.Db.ApproveJoinRequest(bodyRequest.RelatedId)
			if err != nil {
				tools.ErrorJSONResponse(w, http.StatusBadRequest, "something wrong, please try again")
				return
			}
		} else if r.Method == http.MethodDelete {
			response.message = "invitation refused"
			models.Db.RemoveGroupMemberById(bodyRequest.RelatedId)
			if err != nil {
				tools.ErrorJSONResponse(w, http.StatusBadRequest, "something wrong, please try again")
				return
			}
		}

		tools.JSONResponse(w, 200, response)
	default:
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

}
