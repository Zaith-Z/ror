package resources

import (
	"github.com/NorskHelsenett/ror/pkg/clients/rorclient/transports/resttransport/httpclient"

	"github.com/NorskHelsenett/ror/pkg/rorresources"
)

type V2Client struct {
	Client   *httpclient.HttpTransportClient
	basePath string
}

func NewV2Client(client *httpclient.HttpTransportClient) *V2Client {
	return &V2Client{
		Client:   client,
		basePath: "/v2/resources",
	}
}

func (c *V2Client) Get(query rorresources.ResourceQuery) (rorresources.ResourceSet, error) {
	// implementation goes here
	return rorresources.ResourceSet{}, nil
}

func (c *V2Client) Update(res *rorresources.ResourceSet) (*rorresources.ResourceUpdateResults, error) {
	var ret *rorresources.ResourceUpdateResults
	err := c.Client.PostJSON(c.basePath, res, &ret)
	if err != nil {
		return nil, err
	}

	return ret, nil
}

func (c *V2Client) GetByUid(uid string) (rorresources.ResourceSet, error) {
	// implementation goes here
	return rorresources.ResourceSet{}, nil
}

func (c *V2Client) UpdateByUid(uid string, res *rorresources.ResourceSet) (string, error) {
	// implementation goes here
	return "", nil
}

func (c *V2Client) DeleteByUid(uid string) (string, error) {
	// implementation goes here
	return "", nil
}

func (c *V2Client) ExistsByUid(uid string) (bool, error) {
	// implementation goes here
	return false, nil
}

func (c *V2Client) GetHashes() (string, error) {
	// implementation goes here
	return "", nil
}
