export const MetadataTableRow: React.FC<{ label: string, value: any }> = (
	{ label, value }
) => {
	return (
		<tr>
			<td><p><strong>{label}:</strong></p></td>
			<td><p>{value}</p></td>
		</tr>
	)
}