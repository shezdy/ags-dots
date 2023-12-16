# ags-dots

![ags](https://github.com/ddmetz/ags-dots/assets/77217897/77f812a5-770c-4c10-a387-d8afb605d6b2)

## Dependencies

- [ags](https://github.com/Aylur/ags)
- [hyprland](https://github.com/hyprwm/Hyprland)
- dart-sass
- a [nerdfont](https://www.nerdfonts.com/)

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
bind = $mainMod, P, exec, ags -t powermenu

bind = $mainMod, c, exec, ags -r "minimizeFocused()"
bind = $mainMod CONTROL, c, exec, ags -r "restoreClient()"

layerrule = noanim, alttab
binde = ALT, Tab, exec, ags -r "cycleNext(true)"
bind = ALT, Tab, submap, alttab
submap = alttab
    binde = ALT, Tab, exec, ags -r "cycleNext()"
    bindirt = , ALT_L, submap, reset
submap = reset

```
