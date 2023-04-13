import ThemeInsertDto from "./theme.insert.dto";

export default interface ThemeUpdateDto extends ThemeInsertDto {
  id: string
}