import {
    ActionIconStylesParams,
    ColorScheme,
    MantineTheme,
    MantineThemeOverride,
} from "@mantine/core";

export function getBaseTheme(
    theme: MantineTheme,
    colorScheme: ColorScheme
): MantineThemeOverride {
    return {
        headings: headingStyle,
        colorScheme: colorScheme,
        fontFamily: "Open Sans, sans-serif",
        primaryColor: "cyan",
        defaultGradient: {
            deg: 150,
            from: theme.colors.blue[5],
            to: theme.colors.blue[9],
        },
        globalStyles: (theme) => ({
            ".icon-tabler": {
                strokeWidth: "1.2",
            },
        }),
        components: {
            Button: {
                defaultProps: {},
            },
            ActionIcon: {
                defaultProps: {
                    size: "lg",
                    variant: "default",
                },
                styles: (theme, params: ActionIconStylesParams) => ({
                    root: {},
                }),
            },
        },
    };
}

const headingStyle = {
    fontFamily: "Playfair Display",
};
