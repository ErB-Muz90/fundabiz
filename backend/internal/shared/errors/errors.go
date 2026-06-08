package errors

import "fmt"

type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	StatusCode int    `json:"-"`
	Err        error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s (%v)", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

var (
	ErrNotFound             = &AppError{Code: "NOT_FOUND", Message: "Resource not found", StatusCode: 404}
	ErrUnauthorized         = &AppError{Code: "UNAUTHORIZED", Message: "Authentication required", StatusCode: 401}
	ErrForbidden            = &AppError{Code: "FORBIDDEN", Message: "Insufficient permissions", StatusCode: 403}
	ErrConflict             = &AppError{Code: "CONFLICT", Message: "Resource already exists", StatusCode: 409}
	ErrValidation           = &AppError{Code: "VALIDATION_ERROR", Message: "Invalid request data", StatusCode: 422}
	ErrIdempotencyConflict  = &AppError{Code: "IDEMPOTENCY_CONFLICT", Message: "Duplicate request detected", StatusCode: 409}
)

func NewAppError(code, message string, statusCode int) *AppError {
	return &AppError{Code: code, Message: message, StatusCode: statusCode}
}

func WrapError(err error, appErr *AppError) *AppError {
	return &AppError{
		Code:       appErr.Code,
		Message:    appErr.Message,
		StatusCode: appErr.StatusCode,
		Err:        err,
	}
}
