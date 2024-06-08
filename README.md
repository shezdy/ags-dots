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

I use [hyprsplit](https://github.com/shezdy/hyprsplit) so you may need to make some modifications to the bar if you don't use it.

Some stuff you might want in your hyprland.conf:

```
bind = $mainMod, Space, exec, ags -t launcher
bind = $mainMod, P, exec, ags -t powermenu

# restore and minimize
bind = $SUPER, c, exec, echo minimize | socat UNIX-CONNECT:$XDG_RUNTIME_DIR/com.github.Aylur.ags.ags.sock -
bind = $SUPER CONTROL, c, exec, echo restore | socat UNIX-CONNECT:$XDG_RUNTIME_DIR/com.github.Aylur.ags.ags.sock -

# alt tab window switcher
layerrule = noanim, alttab
binde = $ALT, Tab, exec, echo alttab | socat UNIX-CONNECT:$XDG_RUNTIME_DIR/com.github.Aylur.ags.ags.sock -
bind = $ALT, Tab, submap, alttab
submap = alttab
    binde = $ALT, Tab, exec, echo cyclenext | socat UNIX-CONNECT:$XDG_RUNTIME_DIR/com.github.Aylur.ags.ags.sock -
    bindrt = $ALT, $ALT_L, submap, reset
    bind = ,catchall,submap,reset
submap = reset

```
