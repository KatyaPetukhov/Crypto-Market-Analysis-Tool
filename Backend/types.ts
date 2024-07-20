export interface WalletData {
    name: string;
    link: string;
    data: Transaction[];
}
export interface Transaction{
    block: string;
    time: Date;
    amount: string;
    balance: string;
    balanceUSD: string;
    profit: string;
}

export interface BitcoinHistory {
    Date: string;
    Open: string;
    High: string;
    Low: string;
    Close: string;
    AdjClose: string;
    Volume: string;
}