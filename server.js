const express = require('express');
   const { DefaultAzureCredential } = require('@azure/identity');
   const { SecretClient } = require('@azure/keyvault-secrets');

   const app = express();
   const port = process.env.PORT || 8080;

   // Serve static files
   app.use(express.static('public'));

   // API endpoint to get connection status
   app.get('/api/status', async (req, res) => {
       try {
           const keyVaultName = process.env.KEY_VAULT_NAME;
           
           if (!keyVaultName) {
               return res.json({
                   status: 'warning',
                   message: 'Key Vault not configured yet',
                   secretValue: null
               });
           }

           const vaultUrl = `https://${keyVaultName}.vault.azure.net`;
           const credential = new DefaultAzureCredential();
           const client = new SecretClient(vaultUrl, credential);

           const secret = await client.getSecret('DbConnectionString');
           
           res.json({
               status: 'success',
               message: 'Successfully retrieved secret from Key Vault!',
               secretValue: secret.value,
               retrievedAt: new Date().toISOString()
           });
       } catch (error) {
           res.json({
               status: 'error',
               message: error.message,
               secretValue: null
           });
       }
   });

   app.listen(port, () => {
       console.log(`BrightWave Marketing site running on port ${port}`);
   });