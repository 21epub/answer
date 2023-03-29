package schema

type UserStoreSubUser struct{
	NickName string `json:"nickname"`
	UserkName string `json:"username"`
	IsSuperuser  bool `json:"is_superuser"`
	IsStaff  bool `json:"is_staff"`

}

type UserStoretUser struct {
	UserName string `json:"username"`
	IsActive   bool `json:"is_active"`
	Name string `json:"name"`
	IsStaff  bool `json:"is_staff"`
	IsSuperuser  bool `json:"is_superuser"`
	FirstName string `json:"first_name"`
	LastName string `json:"last_name"`
	Email string `json:"email"`
	Source int `json:"source"`
	SourceType int `json:"source_type"`
	Privilege int `json:"privilege"`
	Phone string `json:"phone"`
	IP    string `json:"-" `
	SubUser UserStoreSubUser `json:"subuser"`
	Code int        `json:"code"`
	Msg  string     `json:"msg"`
}



func (user *UserStoretUser) StructureEmail() (email string){
	email = user.SubUser.UserkName + "@" + user.UserName
	return
}