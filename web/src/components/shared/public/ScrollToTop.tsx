import { IconArrowUp } from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, Button, Text, Transition, rem } from "@mantine/core";

function ScrollToTop() {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            <Text ta="center">
                Affix is located at the bottom of the screen, scroll to see it
            </Text>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftSection={
                                <IconArrowUp
                                    style={{ width: rem(16), height: rem(16) }}
                                />
                            }
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    );
}

export default ScrollToTop;
