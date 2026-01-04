import type { Connection, PublicKey } from "@solana/web3.js";

export interface AccountSnapshot {
  address: string;
  label: string;
  owner: string;
  lamports: number;
  dataSize: number;
  data?: Record<string, unknown>;
}

export class StateCapture {
  constructor(private connection: Connection) {}

  async captureAccountState(
    address: PublicKey,
    label: string
  ): Promise<AccountSnapshot> {
    try {
      const accountInfo = await this.connection.getAccountInfo(address);

      if (!accountInfo) {
        return {
          address: address.toBase58(),
          label,
          owner: "11111111111111111111111111111111",
          lamports: 0,
          dataSize: 0,
        };
      }

      return {
        address: address.toBase58(),
        label,
        owner: accountInfo.owner.toBase58(),
        lamports: accountInfo.lamports,
        dataSize: accountInfo.data.length,
        data: this.parseAccountData(accountInfo.data),
      };
    } catch (error) {
      console.error(`Failed to capture state for ${address.toBase58()}:`, error);
      throw error;
    }
  }

  async captureMultipleAccounts(
    accounts: Array<{ address: PublicKey; label: string }>
  ): Promise<AccountSnapshot[]> {
    return Promise.all(
      accounts.map((acc) => this.captureAccountState(acc.address, acc.label))
    );
  }

  private parseAccountData(_data: Buffer): Record<string, unknown> | undefined {
    // TODO: Implement Anchor account deserialization
    // This would use Anchor's IDL to deserialize account data
    // For now, return undefined
    return undefined;
  }

  computeStateDiff(
    before: AccountSnapshot[],
    after: AccountSnapshot[]
  ): Array<{ address: string; changes: string[] }> {
    const changes: Array<{ address: string; changes: string[] }> = [];

    for (const afterAccount of after) {
      const beforeAccount = before.find(
        (acc) => acc.address === afterAccount.address
      );

      const accountChanges: string[] = [];

      if (!beforeAccount) {
        accountChanges.push("Account created");
      } else {
        if (beforeAccount.lamports !== afterAccount.lamports) {
          const diff = afterAccount.lamports - beforeAccount.lamports;
          accountChanges.push(
            `Lamports ${diff > 0 ? "increased" : "decreased"} by ${Math.abs(diff)}`
          );
        }
        if (beforeAccount.dataSize !== afterAccount.dataSize) {
          accountChanges.push(
            `Data size changed from ${beforeAccount.dataSize} to ${afterAccount.dataSize}`
          );
        }
      }

      if (accountChanges.length > 0) {
        changes.push({
          address: afterAccount.address,
          changes: accountChanges,
        });
      }
    }

    return changes;
  }
}

