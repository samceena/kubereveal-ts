import * as k8s from "@kubernetes/client-node";
import { KubernetesSecretTypes } from "./types";
import { EncoderDecoder } from "./EncoderDecoder";
// import {secretDecoders} from './utils'

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// find secrets in the '' namespace
// const namespace = ''

k8sApi
  .listSecretForAllNamespaces()
  // .listNamespacedSecret(namespace)
  .then((data) => {
    data.body.items.map((item) => {
      const secretType = item.type;
      if (secretType === KubernetesSecretTypes.opaque) {
        let secretCount = 0;
        if (item?.data && item.metadata?.name) {
          secretCount = Object.keys(item.data).length;
          console.log(
            `Secret: ${item.metadata.name} in namespace ${item.metadata?.namespace} has ${secretCount} secrets\n`,
          );

          const secretData = item?.data;
          if (secretData) {
            for (const [key, value] of Object.entries(secretData)) {
              const encoderDecoder = new EncoderDecoder(value);
              console.log(
                `key: ${key}, value: ${encoderDecoder.decodeBase64String()}`,
              );
            }
            console.log("-------");
          } else {
            console.log(`No data found for secret ${item.metadata.name} `);
          }
        } else {
          console.log(`Secret: ${item.metadata?.name} has no secrets\n`);
        }
      }
      return undefined;
    });
  })
  .catch((error) => {
    console.log("error loading secrets: ", error);
  });
