import { Alert, Badge, Card, Group, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Category, getCategory } from "../../logic/category";

type CategoryCardProps = {
    id: String;
};

export default function CategoryCard({ id }: CategoryCardProps) {
    const [category, setCategory] = useState<Category>();
    useEffect(() => {
        setCategory(getCategory(id));
    }, [id]);
    return (
        <Card
            onClick={() => {}}
            shadow="xs"
            maw="600px"
            sx={(theme) => ({ cursor: "pointer" })}
        >
            {category ? (
                <Group position="apart" noWrap={true}>
                    <Text fw={700}>{category.name}</Text>
                    <Group spacing="xs">
                        <Badge variant="filled" color="red">
                            3 fällig
                        </Badge>
                        <Badge variant="filled" color="blue">
                            7 neu
                        </Badge>
                    </Group>
                </Group>
            ) : (
                <Alert title="Error" color="red" variant="filled">
                    This card failed to load
                </Alert>
            )}
        </Card>
    );
}
