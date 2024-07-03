const { widget } = figma;
const {
  AutoLayout,
  Input,
  Rectangle,
  SVG,
  Text,
  useEffect,
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
} = widget;

const colors: string[] = ["#FFA198", "#BDE3FF", "#AFF4C6", "#FFE8A3"];

const initialRows: { rowKey: string; headerText: string; bodyText?: string }[] =
  [
    { rowKey: "date", headerText: "date" },
    {
      rowKey: "hypothesis",
      headerText: "hypothesis",
      bodyText: "delete if it's not experiment",
    },
    {
      rowKey: "indicator",
      headerText: "indicator",
      bodyText: "delete if it's not experiment",
    },
    { rowKey: "status", headerText: "status" },
    { rowKey: "problem", headerText: "problem" },
  ];

function CollapsibleTaskCard() {
  const [initialized, setInitialized] = useSyncedState<boolean>(
    "initialized",
    false
  );
  const [collapsed, setCollapsed] = useSyncedState("collapsed", false);
  const [author, setAuthor] = useSyncedState("author", "");
  const [manager, setManager] = useSyncedState("manager", "");
  const [mainContentText, setMainContentText] = useSyncedState(
    "mainContentText",
    ""
  );
  const [onProgress, setOnProgress] = useSyncedState<boolean>(
    "onProgress",
    false
  );
  const [trouble, setTrouble] = useSyncedState<boolean>("trouble", false);
  const [done, setDone] = useSyncedState<boolean>("done", false);
  const [rowKeys, setRowKeys] = useSyncedState<string[]>(
    "rowsNum",
    initialRows.map((header) => header.rowKey)
  );
  const [color, setColor] = useSyncedState("color", colors[2]);
  const rows = useSyncedMap<string>("rows");

  const getRowHeaderKey = (rowKey: string) => `${rowKey}-header`;
  const getRowBodyKey = (rowKey: string) => `${rowKey}-body`;

  /** add row to toggle table */
  const addRow = () => {
    const newKey = (
      "00000" + Math.floor(Math.random() * 1_000_000).toString()
    ).slice(-6);

    if (rowKeys.includes(newKey)) {
      addRow();
    } else {
      setRowKeys([...rowKeys, newKey]);
    }
  };

  /** delete row of toggle table */
  const deleteRow = (rowKey: string) => {
    setRowKeys(rowKeys.filter((key) => key !== rowKey));
    rows.delete(getRowHeaderKey(rowKey));
    rows.delete(getRowBodyKey(rowKey));
  };

  /** when first time widget rendered, add base rows to toggle table */
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    initialRows.forEach((initialRow) => {
      rows.set(getRowHeaderKey(initialRow.rowKey), initialRow.headerText);
      if (initialRow.bodyText) {
        rows.set(getRowBodyKey(initialRow.rowKey), initialRow.bodyText);
      }
    });
  });

  /** widget property menu */
  usePropertyMenu(
    [
      {
        itemType: "toggle",
        tooltip: collapsed ? "expand" : "collapse",
        propertyName: "toggle-collpased",
        isToggled: false,
      },
      {
        itemType: "color-selector",
        tooltip: "Card Color",
        propertyName: "color",
        options: colors.map((color) => ({ tooltip: color, option: color })),
        selectedOption: color,
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "toggle-collpased") {
        setCollapsed(!collapsed);
      } else if (propertyName === "color" && propertyValue) {
        setColor(propertyValue);
      }
    }
  );

  const width: WidgetJSX.Size = 450;

  const shadow: WidgetJSX.Effect = {
    type: "drop-shadow",
    color: "#00000040",
    offset: { x: 0, y: 5 },
    blur: 15,
    showShadowBehindNode: false,
  };

  const toggleButtonShadow: WidgetJSX.Effect = {
    type: "inner-shadow",
    color: "#00000040",
    offset: { x: 0, y: 0 },
    blur: 2,
  };

  return (
    <AutoLayout
      name="Widget"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width={width}
      fill={color}
      spacing={8}
      padding={8}
      cornerRadius={12}
      overflow="visible"
      effect={shadow}
    >
      {/* header */}
      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="center"
        width={"fill-parent"}
        height={"hug-contents"}
        hoverStyle={{ opacity: 0.7 }}
      >
        <AutoLayout
          width={"fill-parent"}
          height={40}
          onClick={() => setCollapsed(!collapsed)}
        />

        <AutoLayout
          direction="horizontal"
          spacing={12}
          padding={{ top: 4, right: 8 }}
        >
          {[
            {
              text: "ongoing",
              state: onProgress,
              setState: setOnProgress,
              color: "#ffff00",
            },
            {
              text: "issue",
              state: trouble,
              setState: setTrouble,
              color: "#ff0000",
            },
            { text: "done", state: done, setState: setDone, color: "#00ff00" },
          ].map((status) => (
            <AutoLayout
              direction="vertical"
              minWidth={32}
              width={"hug-contents"}
              spacing={6}
              horizontalAlignItems="center"
            >
              <Text fontSize={10}>{status.text}</Text>
              <Rectangle
                width={18}
                height={18}
                effect={toggleButtonShadow}
                onClick={() => {
                  status.setState(!status.state);
                }}
                fill={status.state ? status.color : "#ffffff"}
                cornerRadius={4}
              />
            </AutoLayout>
          ))}
        </AutoLayout>
      </AutoLayout>

      <AutoLayout
        direction="horizontal"
        width={"fill-parent"}
        height={"hug-contents"}
      >
        <AutoLayout direction="vertical" width={"fill-parent"} spacing={4}>
          <Text fontSize={12}>{" created by / date"}</Text>
          <Input
            fontSize={14}
            value={author}
            onTextEditEnd={(e) => {
              setAuthor(e.characters);
            }}
            inputFrameProps={{
              fill: "#FFFFFF",
              stroke: "#cecece",
              strokeWidth: 1,
              padding: { horizontal: 12, vertical: 8 },
              cornerRadius: 6,
            }}
          />
        </AutoLayout>
        <AutoLayout direction="vertical" width={"fill-parent"} spacing={4}>
          <Text fontSize={12}>{" person in charge"}</Text>
          <Input
            fontSize={14}
            value={manager}
            onTextEditEnd={(e) => {
              setManager(e.characters);
            }}
            inputFrameProps={{
              fill: "#FFFFFF",
              stroke: "#cecece",
              strokeWidth: 1,
              padding: { horizontal: 12, vertical: 8 },
              cornerRadius: 6,
            }}
          />
        </AutoLayout>
      </AutoLayout>

      <Input
        width={"fill-parent"}
        placeholder="content"
        value={mainContentText}
        fontSize={24}
        fontWeight={600}
        lineHeight={32}
        onTextEditEnd={(e) => setMainContentText(e.characters)}
        inputBehavior="multiline"
        inputFrameProps={{
          fill: "#FFFFFF",
          stroke: "#cecece",
          strokeWidth: 1,
          padding: { horizontal: 16, vertical: 24 },
          cornerRadius: 12,
        }}
      />

      {/* toggle table */}
      <AutoLayout
        direction="vertical"
        width={"fill-parent"}
        fill={"#cecece"}
        verticalAlignItems={"center"}
        padding={1}
        spacing={1}
        hidden={collapsed}
        cornerRadius={8}
        overflow="hidden"
      >
        {rowKeys.map((rowKey) => {
          const headerKey = getRowHeaderKey(rowKey);
          const bodyKey = getRowBodyKey(rowKey);
          const rowHeaderContent = rows.get(headerKey) ?? "";
          const rowBodyContent = rows.get(bodyKey) ?? "";
          return (
            <AutoLayout
              key={rowKey}
              direction="horizontal"
              width={"fill-parent"}
              verticalAlignItems="center"
              spacing={1}
              strokeWidth={1}
            >
              {/* row header */}
              <AutoLayout
                height={"fill-parent"}
                fill="#FFFFFF"
                verticalAlignItems="center"
                horizontalAlignItems="center"
              >
                <Input
                  value={rowHeaderContent}
                  onTextEditEnd={(e) => rows.set(headerKey, e.characters)}
                  fontWeight={600}
                  inputBehavior="multiline"
                  horizontalAlignText="center"
                  width={150}
                  height={"hug-contents"}
                  inputFrameProps={{
                    fill: "#FFFFFF",
                    padding: { horizontal: 16, vertical: 24 },
                  }}
                />
              </AutoLayout>

              {/* row body (content) */}
              <AutoLayout
                width={"fill-parent"}
                height={"fill-parent"}
                fill="#FFFFFF"
                verticalAlignItems="center"
                horizontalAlignItems="center"
              >
                <Input
                  value={rowBodyContent}
                  onTextEditEnd={(e) => rows.set(bodyKey, e.characters)}
                  inputBehavior="multiline"
                  width={"fill-parent"}
                  height={"hug-contents"}
                  inputFrameProps={{
                    fill: "#FFFFFF",
                    padding: { horizontal: 16, vertical: 24, right: 0 },
                  }}
                />
                {/* row delete button */}
                <AutoLayout
                  height={"fill-parent"}
                  fill={"#FFFFFF"}
                  padding={{ top: 12, right: 8 }}
                >
                  <SVG
                    src={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 4L12 12" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      `}
                    opacity={0}
                    hoverStyle={{ opacity: 1 }}
                    onClick={() => deleteRow(rowKey)}
                  />
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
          );
        })}
      </AutoLayout>

      {/* 'add row' button */}
      <AutoLayout
        hidden={collapsed}
        width={"fill-parent"}
        height={40}
        fill={color}
        opacity={0}
        hoverStyle={{ fill: "#585858", opacity: 1 }}
        cornerRadius={20}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={addRow}
      >
        <Text fontSize={12} fill={"#FFFFFF"}>
          add row
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(CollapsibleTaskCard);
