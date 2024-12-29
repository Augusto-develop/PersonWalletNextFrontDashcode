import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { ThemeProvider, CssBaseline, createTheme, FormHelperText } from '@mui/material';

export const themeCustomMuiDatepicker = createTheme({
    palette: {
        mode: 'dark', // Tema escuro
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '14px', // Tamanho da fonte            
                    '& fieldset': {
                        borderWidth: '1px', // Largura da borda
                        borderColor: 'hsl(var(--border))', // Cor personalizada com variável CSS
                    },
                    '&:hover fieldset': {
                        borderColor: 'hsl(var(--border))',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'hsl(var(--border))',
                    },
                },
                input: {
                    fontSize: '14px',
                    padding: '9px 0 9px 13px;',
                    fontWeight: '550',
                    textTransform: 'uppercase'
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    marginRight: '1px', // Adiciona a margem à direita
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '14px', // Tamanho da fonte do label
                    color: 'hsl(var(--border))',
                    '&.Mui-focused': {
                        color: 'hsl(var(--border))',
                    },
                },
            },
        },
    },
});

export type DayJsObject = {
    $L: string;  // Locale, por exemplo, 'pt-br'
    $d: string;  // A data como string ISO 8601 (ex: '2024-02-27T03:00:00.000Z')
    $y: number;  // Ano (ex: 2024)
    $M: number;  // Mês (0-indexed, ex: 1 para fevereiro)
    $D: number;  // Dia do mês (ex: 27)
    $W: number;  // Dia da semana (ex: 2 para terça-feira)
    $H: number;  // Hora (ex: 0 para meia-noite)
    $m: number;  // Minuto (ex: 0)
    $s: number;  // Segundo (ex: 0)
    $ms: number; // Milissegundos (ex: 0)
    $x: Record<string, any>; // Campo adicional para dados internos (normalmente vazio)
    $isDayjsObject: boolean;  // Indica se é um objeto Day.js
};