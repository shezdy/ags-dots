# ags-dots
![preview](https://github.com/ddmetz/ags-dots/assets/77217897/6cae17a2-4c45-41d7-8953-b9162ceb9cf4)

## Dependencies
- [ags](https://github.com/Aylur/ags)
- [hyprland](https://github.com/hyprwm/Hyprland)
- dart-sass
- nerdfonts
### Optional
- playerctl
- gvfs
- brightnessctl
- swaylock
- pavucontrol
- nm-connection-editor

## Hyprland
I use [split-monitor-workspaces](https://github.com/Duckonaut/split-monitor-workspaces) so you may need to make some modifications to the bar if you don't use it.

Some stuff you might want in your hyprland.conf:

```
bind = $mainMod, Space, exec, ags -t launcher

bind = $mainMod, c, exec, ags -r "minimizeFocused()"
bind = $mainMod CONTROL, c, exec, ags -r "restoreClient()"

layerrule = noanim, alttab
binde = ALT, Tab, exec, ags -r "initialAltTab()"
bind = ALT, Tab, submap, alttab
submap = alttab
    binde = ALT, Tab, exec, ags -r "cycleNext()"
    bindirt = , ALT_L, submap, reset 
submap = reset

```
