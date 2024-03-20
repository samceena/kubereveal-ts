import * as k8s from "@kubernetes/client-node";
import { EncoderDecoder } from "./EncoderDecoder";
import {program} from 'commander'

let namespaceValue;
let k8sConfigFile;
let secretName: string | undefined  = undefined;

program
  .option('-n, --namespace <namespace>', 'Which kubernetes namespace to search for secret from', 'default')
  .option('-f, --file <filepath>', 'Path to the kubernetes config file to use')
  .option('-s, --secret <secretname>', 'The name of the secret to search for and decode1')

program.parse( process.argv )
const options = program.opts()


if (options.namespace){
  namespaceValue = options.namespace
}
if (options.file){
  k8sConfigFile = options.file
}
if (options.secret){
  secretName = options.secret
}
let welcomeText = `\nFetching secrets for ${secretName} in namespace ${namespaceValue} `
if ( k8sConfigFile ) {
  welcomeText += `using kubeconfig file ${k8sConfigFile}\n`
} else {
  welcomeText += `using default kubeconfig file\n`
}
console.log(welcomeText)


const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

if (!secretName){
  console.log('Secret name is required')
} else {
  k8sApi
    .readNamespacedSecret(secretName, namespaceValue)
    .then((data) => {
      if ( data?.body?.data ) {
        for (const [key, value] of Object.entries(data.body.data)){
            const encoderDecoder = new EncoderDecoder(value);
            console.log(
              `Secret key: ${key}, Secret value: ${encoderDecoder.decodeBase64String()}`,
              );
        }
      }
    })
    .catch((error) => {
      if (error.toString().includes("HttpError") >= 0){
        console.log(`\nSecret ${secretName} not found\n`)
      } else {
        console.log("Error fetching secrets:", error);
      }
    });
}
