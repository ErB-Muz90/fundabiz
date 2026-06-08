package mpesa

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type STKPushRequest struct {
	BusinessShortCode string `json:"BusinessShortCode"`
	Password          string `json:"Password"`
	Timestamp         string `json:"Timestamp"`
	TransactionType   string `json:"TransactionType"`
	Amount            int    `json:"Amount"`
	PartyA            string `json:"PartyA"`
	PartyB            string `json:"PartyB"`
	PhoneNumber       string `json:"PhoneNumber"`
	CallBackURL       string `json:"CallBackURL"`
	AccountReference  string `json:"AccountReference"`
	TransactionDesc   string `json:"TransactionDesc"`
}

type STKPushResponse struct {
	MerchantRequestID   string `json:"MerchantRequestID"`
	CheckoutRequestID   string `json:"CheckoutRequestID"`
	ResponseCode        string `json:"ResponseCode"`
	ResponseDescription string `json:"ResponseDescription"`
	CustomerMessage     string `json:"CustomerMessage"`
}

func (c *DarajaClient) InitiateSTKPush(phone, reference string, amount float64) (*STKPushResponse, error) {
	token, err := c.GetAccessToken()
	if err != nil {
		return nil, fmt.Errorf("get token: %w", err)
	}

	timestamp := generateTimestamp()
	password := generatePassword(c.cfg.MPesaShortCode, c.cfg.MPesaPassKey, timestamp)

	amountInt := int(amount)

	reqBody := STKPushRequest{
		BusinessShortCode: c.cfg.MPesaShortCode,
		Password:          password,
		Timestamp:         timestamp,
		TransactionType:   "CustomerPayBillOnline",
		Amount:            amountInt,
		PartyA:            phone,
		PartyB:            c.cfg.MPesaShortCode,
		PhoneNumber:       phone,
		CallBackURL:       "",
		AccountReference:  reference,
		TransactionDesc:   "Funds deposit",
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	url := c.baseURL + "/mpesa/stkpush/v1/processrequest"
	req, err := http.NewRequest("POST", url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("stk push: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	var stkResp STKPushResponse
	if err := json.Unmarshal(respBody, &stkResp); err != nil {
		return nil, fmt.Errorf("parse response: %w", err)
	}

	return &stkResp, nil
}
