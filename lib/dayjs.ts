import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Adiciona os plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Define o fuso horário padrão (opcional)
dayjs.tz.setDefault('America/Sao_Paulo');

export default dayjs;
