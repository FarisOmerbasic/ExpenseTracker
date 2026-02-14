import type { SelectOption } from '../types';

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: '🇺🇸 USD – US Dollar' },
  { value: 'EUR', label: '🇪🇺 EUR – Euro' },
  { value: 'GBP', label: '🇬🇧 GBP – British Pound' },
  { value: 'CAD', label: '🇨🇦 CAD – Canadian Dollar' },
  { value: 'AUD', label: '🇦🇺 AUD – Australian Dollar' },
  { value: 'JPY', label: '🇯🇵 JPY – Japanese Yen' },
  { value: 'CHF', label: '🇨🇭 CHF – Swiss Franc' },
  { value: 'SEK', label: '🇸🇪 SEK – Swedish Krona' },
  { value: 'NOK', label: '🇳🇴 NOK – Norwegian Krone' },
  { value: 'DKK', label: '🇩🇰 DKK – Danish Krone' },
  { value: 'PLN', label: '🇵🇱 PLN – Polish Złoty' },
  { value: 'CZK', label: '🇨🇿 CZK – Czech Koruna' },
  { value: 'HUF', label: '🇭🇺 HUF – Hungarian Forint' },
  { value: 'RON', label: '🇷🇴 RON – Romanian Leu' },
  { value: 'BGN', label: '🇧🇬 BGN – Bulgarian Lev' },
  { value: 'TRY', label: '🇹🇷 TRY – Turkish Lira' },
  { value: 'BAM', label: '🇧🇦 BAM – Bosnian Mark' },
  { value: 'RSD', label: '🇷🇸 RSD – Serbian Dinar' },
  { value: 'MKD', label: '🇲🇰 MKD – Macedonian Denar' },
  { value: 'ALL', label: '🇦🇱 ALL – Albanian Lek' },
  { value: 'BRL', label: '🇧🇷 BRL – Brazilian Real' },
  { value: 'MXN', label: '🇲🇽 MXN – Mexican Peso' },
  { value: 'INR', label: '🇮🇳 INR – Indian Rupee' },
  { value: 'CNY', label: '🇨🇳 CNY – Chinese Yuan' },
  { value: 'KRW', label: '🇰🇷 KRW – South Korean Won' },
  { value: 'NZD', label: '🇳🇿 NZD – New Zealand Dollar' },
  { value: 'ZAR', label: '🇿🇦 ZAR – South African Rand' },
  { value: 'AED', label: '🇦🇪 AED – UAE Dirham' },
  { value: 'SGD', label: '🇸🇬 SGD – Singapore Dollar' },
  { value: 'HKD', label: '🇭🇰 HKD – Hong Kong Dollar' },
];

export const ACCOUNT_TYPES: SelectOption[] = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Credit', label: 'Credit Card' },
  { value: 'Investment', label: 'Investment' },
];

export const PAYMENT_METHOD_TYPES: SelectOption[] = [
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'PayPal', label: 'PayPal' },
  { value: 'Digital Wallet', label: 'Digital Wallet' },
  { value: 'Crypto', label: 'Cryptocurrency' },
  { value: 'Other', label: 'Other' },
];

export const PAGE_SIZE = 10;
