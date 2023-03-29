package controller

import (
	"errors"
	"github.com/answerdev/answer/internal/base/handler"
	"github.com/answerdev/answer/internal/schema"
	"github.com/answerdev/answer/internal/service"
	"github.com/answerdev/answer/internal/base/translator"
	// "github.com/segmentfault/pacman/log"
	"github.com/gin-gonic/gin"
)

var UserstoreUrl string = service.GetEnv("USER_STORE_AUTH_URL", "https://yapi.epub360.com/mock/292/v3/api/auth/")

func (uc *UserController) UserEpub360Login(ctx *gin.Context) {
    token := ctx.Query("token")
	// 获取用户信息
	userstoreUser := &schema.UserstoretUser{}
    err := service.GetResponseJson(UserstoreUrl, token, userstoreUser)
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
	result := &schema.Epub360User{}
	if handler.BindAndCheck(ctx, result) {
		return
	}
	// 构造answer所需要的用户信息
	result.IP = ctx.ClientIP()
	username := userstoreUser.SubUser.UserkName + "@" + userstoreUser.UserName
	result.Name = username
	result.Email = username
	result.DisplayName = userstoreUser.SubUser.NickName
	resp, errFields, err := uc.userService.Epub360UserBackend(ctx, result)
	if err != nil {
		handler.HandleResponse(ctx, err, nil)
		return
	}
	if resp == nil {
		handler.HandleResponse(ctx, errors.New("response is nil"), nil)
		return
	}
	if len(errFields) > 0 {
		for _, field := range errFields {
			field.ErrorMsg = translator.
				Tr(handler.GetLang(ctx), field.ErrorMsg)
		}
		handler.HandleResponse(ctx, err, errFields)
	} else {
		// ctx.Redirect(http.StatusFound, "/")
		handler.HandleResponse(ctx, err, resp)
	}
}