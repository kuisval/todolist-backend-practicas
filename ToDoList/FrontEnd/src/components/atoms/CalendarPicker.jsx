import styled from 'styled-components';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 12px;
  margin-top: 8px;

  .rdp {
    --rdp-accent-color: #4f46e5;
    --rdp-background-color: #e0e7ff;
    margin: 0;
  }
`;

export function CalendarPicker({ selected, onSelect, onClose }) {
  return (
    <Wrapper>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => { onSelect(date); onClose(); }}
        locale={es}
        disabled={{ before: new Date() }}
      />
    </Wrapper>
  );
}

export default CalendarPicker;