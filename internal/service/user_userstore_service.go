package service

import (
	"os"
	"context"
	"encoding/json"
	"time"
	"net/http"
	// "github.com/answerdev/answer/internal/base/reason"
	"github.com/answerdev/answer/internal/base/validator"
	"github.com/answerdev/answer/internal/entity"
	"github.com/answerdev/answer/internal/schema"
	"github.com/answerdev/answer/internal/service/role"
	// "github.com/segmentfault/pacman/errors"
	"github.com/segmentfault/pacman/log"
)

var myClient = &http.Client{Timeout: 5 * time.Second}
func GetUserstoreUserJson(url string, token string, target *schema.UserstoretUser) error {
    r, err := myClient.Get(url + "?token=" + token)
    if err != nil {
        return err
    }
	target.Code = r.StatusCode
    defer r.Body.Close()
    return json.NewDecoder(r.Body).Decode(target)
}

func GetEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}


// UserRegisterByEmail user register
func (us *UserService) UserstoreBackend(ctx context.Context, registerUserInfo *schema.UserstoretUser) (
	resp *schema.GetUserResp, errFields []*validator.FormErrorField, err error,
) {
	// 根据email查找用户是否存在
	userInfo, _, err := us.userRepo.GetByEmail(ctx, registerUserInfo.StructureEmail())
	if err != nil {
		return nil, nil, err
	}
	if userInfo.ID == "" {
		// 用户不存在 注册&&登录
		userInfo, err := us.Epub360UserRegister(ctx, registerUserInfo)
		if err != nil {
			log.Error("userstore register", err)
			return nil, nil, err
		}
		resp, err := us.Epub360UserLogin(ctx, userInfo, registerUserInfo)
		if err != nil {
			log.Error("userstore login", err)
			return nil, nil, err
		}
		return resp, nil, nil
	}else{
		// 登录
		resp, err := us.Epub360UserLogin(ctx, userInfo, registerUserInfo)
		if err != nil {
			log.Error(err)
			return nil, nil, err
		}
		return resp, nil, nil
	}
}

// 登录
func (us *UserService) Epub360UserLogin(ctx context.Context, userInfo *entity.User, registerUserInfo *schema.UserstoretUser) (resp *schema.GetUserResp, err error) {
	// if userInfo.Status == entity.UserStatusDeleted {
	// 	return nil, errors.BadRequest(reason.EmailOrPasswordWrong)
	// }
	// DisplayName不同则更新
	if userInfo.DisplayName != registerUserInfo.SubUser.NickName {
		err = us.userRepo.UpdateDisplayName(ctx, userInfo.ID, registerUserInfo.SubUser.NickName)
		if err != nil {
			log.Error("UpdateUserinfo", err.Error())
		}else{
			// userInfo.DisplayName = registerUserInfo.DisplayName
			userInfo, _, _ = us.userRepo.GetByEmail(ctx, registerUserInfo.StructureEmail())
		}
	}
	err = us.userRepo.UpdateLastLoginDate(ctx, userInfo.ID)
	if err != nil {
		log.Error("UpdateLastLoginDate", err.Error())
	}

	roleID, err := us.userRoleService.GetUserRole(ctx, userInfo.ID)
	if err != nil {
		return nil, err
	}

	resp = &schema.GetUserResp{}
	resp.GetFromUserEntity(userInfo)
	userCacheInfo := &entity.UserCacheInfo{
		UserID:      userInfo.ID,
		EmailStatus: userInfo.MailStatus,
		UserStatus:  userInfo.Status,
		IsAdmin:     roleID == role.RoleAdminID,
	}
	resp.AccessToken, err = us.authService.SetUserCacheInfo(ctx, userCacheInfo)
	if err != nil {
		return nil, err
	}
	resp.IsAdmin = userCacheInfo.IsAdmin
	if resp.IsAdmin {
		err = us.authService.SetAdminUserCacheInfo(ctx, resp.AccessToken, userCacheInfo)
		if err != nil {
			return nil, err
		}
	}

	return resp, nil
}

// 查询不到，进行注册
func (us *UserService) Epub360UserRegister(ctx context.Context, registerUserInfo *schema.UserstoretUser) (userInfo *entity.User, err error) {
	userInfo = &entity.User{}
	userInfo.EMail = registerUserInfo.StructureEmail()
	userInfo.DisplayName = registerUserInfo.SubUser.NickName
	// userInfo.Pass, err = us.encryptPassword(ctx, registerUserInfo.Pass)
	// if err != nil {
	// 	return nil, err
	// }
	// username
	userInfo.Username, err = us.userCommonService.MakeUsername(ctx, registerUserInfo.SubUser.UserkName)
	userInfo.IPInfo = registerUserInfo.IP
	userInfo.LastLoginDate = time.Now()
	// 声望初始化为1
	userInfo.Rank = 1
	// 注册后为活跃用户
	userInfo.Status = entity.UserStatusAvailable
	userInfo.MailStatus = entity.EmailStatusAvailable
	err = us.userRepo.AddUser(ctx, userInfo)
	if err != nil {
		return nil, err
	}
	return userInfo, nil
}
