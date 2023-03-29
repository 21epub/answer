package controller

import (
	"errors"
	"github.com/answerdev/answer/internal/base/handler"
	"github.com/answerdev/answer/internal/schema"
	"github.com/answerdev/answer/internal/service"
	// "github.com/answerdev/answer/internal/base/translator"
	// "github.com/segmentfault/pacman/log"
	"github.com/gin-gonic/gin"
)

var UserstoreUrl string = service.GetEnv("USER_STORE_AUTH_URL", "https://yapi.epub360.com/mock/292/v3/api/auth/")

func (uc *UserController) UserstoreLogin(ctx *gin.Context) {
    token := ctx.Query("token")
	// 获取用户信息
	userstoreUser := &schema.UserStoretUser{}
    err := service.GetUserStoreUser(UserstoreUrl, token, userstoreUser)
	if err != nil {
		handler.HandleResponse(ctx, err, nil)
		return
	}
	// 请求用户信息失败
	if userstoreUser.Code != 200 {
		ctx.JSON(400, gin.H{
			"code": userstoreUser.Code,
			"msg":  userstoreUser.Msg,
		})
		return
	}
	userstoreUser.IP = ctx.ClientIP()
	resp, err := uc.userService.UserStoreBackend(ctx, userstoreUser)
	if err != nil {
		handler.HandleResponse(ctx, err, nil)
		return
	}
	if resp == nil {
		handler.HandleResponse(ctx, errors.New("response is nil"), nil)
		return
	}
	handler.HandleResponse(ctx, err, resp)
	// if len(errFields) > 0 {
	// 	for _, field := range errFields {
	// 		field.ErrorMsg = translator.
	// 			Tr(handler.GetLang(ctx), field.ErrorMsg)
	// 	}
	// 	handler.HandleResponse(ctx, err, errFields)
	// } else {
	// 	handler.HandleResponse(ctx, err, resp)
	// }
}