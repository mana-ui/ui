import styled from "@emotion/styled";

const resolveColumns = ({columns}) => {
	const s = []
	for (let i = 0; i < columns; i++ ) {
		s.push('1fr')
	}
	return s.join(' ')
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${resolveColumns};
  gap: ${({gap}) => `${gap}px ${gap}px`};
`;

export default Grid;
