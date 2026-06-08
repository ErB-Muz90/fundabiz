package mpesa

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type B2BRequest struct {
	Initiator              string `json:"Initiator"`
	SecurityCredential     string `json:"SecurityCredential"`
	CommandID              string `json:"CommandID"`
	SenderIdentifierType   int    `json:"SenderIdentifierType"`
	RecieverIdentifierType int    `json:"RecieverIdentifierType"`
	Amount                 int    `json:"Amount"`
	PartyA                 string `json:"PartyA"`
	PartyB                 string `json:"PartyB"`
	Remarks                string `json:"Remarks"`
	QueueTimeOutURL        string `json:"QueueTimeOutURL"`
	ResultURL              string `json:"ResultURL"`
	Occasion               string `json:"Occasion"`
}

type B2BResponse struct {
	ConversationID           string `json:"ConversationID"`
	OriginatorConversationID string `json:"OriginatorConversationID"`
	ResponseCode             string `json:"ResponseCode"`
	ResponseDescription      string `json:"ResponseDescription"`
}

func (c *DarajaClient) InitiateB2BPayment(recipientPhone, remarks string, amount float64) (*B2BResponse, error) {
	token, err := c.GetAccessToken()
	if err != nil {
		return nil, fmt.Errorf("get token: %w", err)
	}

	amountInt := int(amount)

	reqBody := B2BRequest{
		Initiator:              "fundabiz",
		SecurityCredential:     securityCredential(c.cfg.MPesaSecurityCred),
		CommandID:              "BusinessPayBill",
		SenderIdentifierType:   4,
		RecieverIdentifierType: 4,
		Amount:                 amountInt,
		PartyA:                 c.cfg.MPesaShortCode,
		PartyB:                 recipientPhone,
		Remarks:                remarks,
		QueueTimeOutURL:        "",
		ResultURL:              "",
		Occasion:               "",
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	url := c.baseURL + "/mpesa/b2b/v1/paymentrequest"
	req, err := http.NewRequest("POST", url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("b2b payment: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	var b2bResp B2BResponse
	if err := json.Unmarshal(respBody, &b2bResp); err != nil {
		return nil, fmt.Errorf("parse response: %w", err)
	}

	return &b2bResp, nil
}
