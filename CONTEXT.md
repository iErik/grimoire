# Grimoire

A desktop Markdown note editor. Notes are kept in notebooks, read in the main
window and edited in separate editor windows.

## Language

### Notes and notebooks

**Note**:
A single Markdown document, stored as HTML, that belongs to exactly one
notebook.
_Avoid_: Document, page, entry

**Notebook**:
A named collection of notes.
_Avoid_: Folder, category

### Windows

**Active notebook**:
The notebook whose notes the main window is showing. Changing it selects that
notebook's newest note.

**Selected note**:
The note shown in the main window's note viewer, always in the active
notebook, or none when the notebook is empty.

**Edited note**:
The note an editor window is open on, identified by that window's route. It is
independent of the selected note: the main window can select another note
while the editor stays open.
_Avoid_: Selected note (for the editor window's note)

### Themes

**Application theme**:
A named set of palette colors for the application chrome. Aurora is the only application theme.
_Avoid_: UI theme, editor theme

**Palette color**:
One of primary, secondary, accent, background, or foreground.
_Avoid_: theme color

**Editor theme**:
An Ace editor theme name chosen for the note editor. It is not an application theme.
_Avoid_: application theme, UI theme
