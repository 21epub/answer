package migrations

import (
    "fmt"
    "xorm.io/xorm"
    "github.com/answerdev/answer/internal/entity"
)

func addAnswerContent(x *xorm.Engine) (err error) {
    
 err = x.Sync(new(entity.Answer), new(entity.Question))
 if err != nil {
  return fmt.Errorf("sync table failed %w", err)
 }
 return nil
}