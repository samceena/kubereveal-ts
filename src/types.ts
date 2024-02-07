export type SecretObject = {
  name: string;
  secrets: {
    [key: string]: string;
  };
  namespace: string;
};

// Based on the types here https://kubernetes.io/docs/concepts/configuration/secret/#secret-types
export enum KubernetesSecretTypes {
  opaque = "Opaque",
  ServiceAccountToken = "kubernetes.io/service-account-token",
  dockercfg = "Kubernetes.io/dockercfg",
  dockerconfigjson = "kubernetes.io/dockerconfigjson",
  basicAuth = "kubernetes.io/basic-auth",
  sshAuth = "kubernetes.io/ssh-auth",
  tls = "kubernetes.io/tls",
  token = "bootstrap.kubernetes.io/token",
}
