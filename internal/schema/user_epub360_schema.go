package schema

type UserstoreSubUser struct{
	NickName string `json:"nickname"`
	UserkName string `json:"username"`
	IsSuperuser  bool `json:"is_superuser"`
	IsStaff  bool `json:"is_staff"`

}

type UserstoretUser struct {
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
	SubUser UserstoreSubUser `json:"subuser"`
	Code int        `json:"code"`
	Msg  string     `json:"msg"`
}


type Epub360User struct{
	// name
	Name string `json:"name"`
	// email
	Email string `json:"e_mail"`
	// password
	Pass        string `json:"-" `
	IP          string `json:"-" `
	DisplayName string `json:"-" `
}