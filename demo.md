# DealMint Demo Walkthrough

> A 2-minute guide to experiencing the full DealMint flow

## 🎯 Scenario

**Deal**: Enterprise Software License for Q4 2025  
**Original Price**: $1,000 USD  
**Final Price**: $960 USD (after AI negotiation)  
**Payment**: PYUSD on Ethereum Sepolia  
**Settlement**: USDC on Base Sepolia via Avail Nexus

---

## 📝 Step-by-Step Walkthrough

### 1. Create a Deal (30 seconds)

**As the Seller:**

1. Navigate to `http://localhost:3000`
2. Click **"Mint a Deal"** button
3. Connect your wallet (MetaMask, Rainbow, etc.)
4. Fill in the form:
   - **Title**: "Enterprise Software License - Q4 2025"
   - **Amount**: 1000
   - **Allow Negotiation**: ✅ Checked
5. Click **"Mint Deal"**
6. You'll be redirected to the deal page with a unique URL

**Expected Output:**

- Deal created with slug like `/d/enterprise-software-license-q4-2025`
- Status: `created`
- QR code available for sharing

---

### 2. AI Agent Negotiation (20 seconds)

**As the Buyer (or continuing as Seller for demo):**

1. On the deal page, find the **"AI Agent Negotiation"** panel
2. Click **"Run Negotiation"** button
3. Watch the A2A conversation unfold:
   - Seller agent offers $1,000
   - Buyer agent requests early payment discount
   - Seller agent accepts with 4% discount
4. Review the final terms:
   - **Original Amount**: $1,000
   - **Final Amount**: $960
   - **Discount**: $40 (4% early payment)

**Behind the Scenes:**

- **A2A Protocol**: Agents exchange structured messages
- **Negotiation Rules Applied**:
  - Early payment discount: 4%
  - Deadline set: 7 days from now
- **AP2 Mandate Generated**: JSON payment mandate created

**View Details:**

- Click "Show A2A Conversation Transcript" to see message exchange
- Click "View AP2 Payment Mandate" to see the JSON mandate

---

### 3. Pay with PYUSD (45 seconds)

**As the Buyer:**

1. Scroll to the **"Payment"** panel
2. If not connected, click **"Connect Wallet"**
3. Ensure you're on **Sepolia testnet** with PYUSD balance
4. Review payment details:
   - Amount: $960 PYUSD
   - Recipient: Seller's address
   - Network: Sepolia
5. Click **"Pay with PYUSD"**
6. Approve the transaction in your wallet
7. Wait for confirmation (~15 seconds)

**Transaction Details:**

- **Token**: PYUSD (PayPal USD)
- **Contract**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **Type**: ERC-20 transfer
- **Explorer**: Link to Etherscan

**Note**: If you don't have testnet PYUSD, see "Getting Testnet Tokens" below

---

### 4. Cross-Chain Settlement (30 seconds)

**Continuing as Buyer:**

1. After payment confirmation, scroll to **"Cross-Chain Settlement"** panel
2. Review the settlement details:
   - **Source**: PYUSD on Ethereum Sepolia
   - **Destination**: USDC on Base Sepolia
   - **Bridge**: Powered by Avail Nexus
3. Click **"Settle Cross-Chain"**
4. Avail Nexus initiates the bridging process
5. Watch the status update in real-time:
   - `pending` → `bridging` → `executing` → `completed`

**Behind the Scenes:**

- **Avail Nexus Intent**: Cross-chain intent created
- **Intent ID**: Unique identifier for tracking
- **Estimated Time**: ~5 minutes (demo: instant)
- **Bridge Transactions**:
  - Source chain tx (Sepolia)
  - Destination chain tx (Base Sepolia)

---

### 5. View Timeline & Receipt (15 seconds)

**Final Review:**

1. Check the **Timeline** panel on the right:

   - ✅ Deal Created
   - ✅ Mandate Created
   - ✅ PYUSD Payment
   - ✅ Cross-Chain Settlement

2. Review **Receipt & Details**:

   - Deal information
   - Payment details with Etherscan link
   - Settlement details with BaseScan link
   - Click **"Download Receipt"** for JSON export

3. Share the deal:
   - Click **"Share Deal"** button
   - Scan QR code or copy link
   - Send to others for transparency

---

## 🧪 Getting Testnet Tokens

### Sepolia ETH (for gas)

```bash
# Sepolia Faucet
https://sepoliafaucet.com/
https://www.alchemy.com/faucets/ethereum-sepolia
```

### PYUSD on Sepolia

**Option 1: Faucet** (if available)

- Check PayPal developer docs

**Option 2: Mock Token** (for demo)

- Deploy a mock ERC-20 token
- Update `NEXT_PUBLIC_PYUSD_ADDRESS` in `.env.local`

### Base Sepolia ETH

```bash
# Base Sepolia Faucet
https://www.alchemy.com/faucets/base-sepolia
```

---

## 📊 Expected Results

### Database State After Full Flow

**Deal**

```json
{
  "status": "settled",
  "amount": 1000,
  "allowNegotiation": true
}
```

**Agreement**

```json
{
  "finalAmount": 960,
  "discount": 40,
  "mandateJson": "{ AP2 mandate JSON }",
  "a2aTranscript": "{ A2A conversation JSON }"
}
```

**Payment**

```json
{
  "token": "PYUSD",
  "amount": 960,
  "txHash": "0x...",
  "network": "sepolia",
  "status": "confirmed"
}
```

**Settlement**

```json
{
  "sourceNetwork": "sepolia",
  "destNetwork": "base-sepolia",
  "destToken": "USDC",
  "intentId": "avail-intent-...",
  "status": "completed"
}
```

---

## 🔍 Key Features Demonstrated

### 1. A2A Protocol in Action

- Structured agent-to-agent communication
- Message types: offer, counter-offer, accept
- Full conversation transcript stored

### 2. AP2 Payment Mandate

- Standardized payment format
- Terms include discount reasoning
- Machine-readable for automation

### 3. PYUSD Integration

- Stablecoin payment on Ethereum
- ERC-20 standard transaction
- 1:1 USD peg maintained

### 4. Avail Nexus Cross-Chain

- Intent-based bridging
- Multi-chain settlement
- Status tracking with intent ID

### 5. Full Transparency

- Timeline visualization
- Explorer links for all transactions
- Downloadable receipt

---

## 🎬 Advanced Demo Scenarios

### Scenario 2: Bulk Purchase Discount

1. Create deal with amount ≥ $500
2. Run negotiation → Gets 5% bulk discount + 4% early payment = 9% total
3. Proceed with payment and settlement

### Scenario 3: No Negotiation

1. Create deal with "Allow Negotiation" unchecked
2. Payment panel shows original amount
3. Direct payment without negotiation step

### Scenario 4: Multiple Deals

1. Create multiple deals with different amounts
2. Compare negotiation outcomes
3. View all deals from home page

---

## 🐛 Troubleshooting

### Issue: Transaction Fails

**Solution:**

- Check you have sufficient PYUSD balance
- Ensure you're on Sepolia testnet
- Verify gas balance (ETH) for transaction fees

### Issue: Settlement Stuck

**Solution:**

- Check Avail Nexus status endpoint
- Verify intent ID in settlement record
- Wait 5-10 minutes for actual cross-chain bridging

### Issue: Wallet Not Connecting

**Solution:**

- Refresh page
- Clear cache
- Try different wallet provider
- Check MetaMask network settings

---

## 📸 Screenshots

### Landing Page

![Landing](./docs/screenshots/landing.png)

### Deal Creation

![Create Deal](./docs/screenshots/create-deal.png)

### Negotiation Panel

![Negotiation](./docs/screenshots/negotiation.png)

### Payment Flow

![Payment](./docs/screenshots/payment.png)

### Settlement

![Settlement](./docs/screenshots/settlement.png)

### Timeline

![Timeline](./docs/screenshots/timeline.png)

---

## ⏱️ Total Demo Time

- **Create Deal**: 30s
- **Negotiation**: 20s
- **Payment**: 45s
- **Settlement**: 30s
- **Review**: 15s

**Total**: ~2 minutes 20 seconds

---

## 🎓 Learning Points

1. **A2A Protocol**: How agents communicate and negotiate
2. **AP2 Mandates**: Standardized payment agreement format
3. **PYUSD**: Stablecoin payment on Ethereum
4. **Avail Nexus**: Cross-chain settlement infrastructure
5. **Full Stack Web3**: Complete dApp with real blockchain interactions

---

## 🚀 Next Steps

After the demo:

1. Explore the codebase structure
2. Check API routes in `apps/web/app/api`
3. Review negotiation logic in `packages/core/negotiation`
4. Experiment with different discount scenarios
5. Deploy to testnet or mainnet

---

**Enjoy the DealMint experience!** 🌟
