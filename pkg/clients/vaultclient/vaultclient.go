package vaultclient

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/NorskHelsenett/ror/pkg/rlog"

	"github.com/dotse/go-health"

	"github.com/hashicorp/vault-client-go"
)

var vaultClient *VaultClient = &VaultClient{}

type VaultClient struct {
	Context context.Context
	Client  *vault.Client
	Url     string
}

type VaultCredsHelper interface {
	GetToken() string
	Login(vc *VaultClient) error
}

// creates a new vault client
func New(ctx context.Context, credsHelper VaultCredsHelper, url string) (*VaultClient, error) {

	client, err := getClient(url)
	if err != nil {
		return nil, err
	}

	vaultClient := VaultClient{
		Context: ctx,
		Client:  client,
	}

	err = credsHelper.Login(&vaultClient)
	if err != nil {
		return nil, err
	}

	health.Register("vault", vaultClient)
	return &vaultClient, nil
}

func getClient(vaultUrl string) (*vault.Client, error) {
	client, err := vault.New(
		vault.WithAddress(vaultUrl),
		vault.WithRequestTimeout(30*time.Second),
	)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (rc VaultClient) CheckHealth() []health.Check {
	c := health.Check{
		Status: health.StatusPass,
		Output: "Vault connection ok",
	}
	ok, err := rc.Ping()
	if !ok {
		rlog.Error("vault ping returned error", err)
		c.Status = health.StatusFail
		c.Output = "Could not connect to vault"
	}

	return []health.Check{c}
}

func (v VaultClient) Ping() (bool, error) {
	if v.Client == nil {
		err := fmt.Errorf("vault client is not initialized")
		rlog.Error("could not ping vault", err)
		return false, err
	}
	_, err := v.Client.Auth.TokenLookUpSelf(v.Context)
	if err != nil {
		return false, err
	}

	return true, nil
}

// DEPRECATED. we dont want to have to rely on calling this withing the lease
// time of the tokens to be able to renew them. We use WaitForTokenRenewal go
// routine instead

// DEPRECATED. Use New() instead
func NewVaultClient(role string, url string) *VaultClient {
	var err error
	var credsHelper VaultCredsHelper

	tokenFilePath := "/var/run/secrets/kubernetes.io/serviceaccount/token"
	if _, err := os.Stat(tokenFilePath); err == nil {
		credsHelper = NewKubernetesVaultCredsHelper(role, 3600)

	} else {
		credsHelper = NewStaticVaultCredsHelper("S3cret!")
	}

	client, err := New(context.Background(), credsHelper, url)
	if err != nil {
		rlog.Error("error initializing vault client", err)
		return nil
	}
	return client
}
