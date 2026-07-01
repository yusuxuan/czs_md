// ==========================================
// 充值神的MD插件 —— TurboWarp / CCW 自定义扩展
// 作者：充值神
// 功能：在舞台上渲染 Markdown 内容为可自定义的悬浮窗口
// 注意：本扩展需要在"非沙盒模式（unsandboxed）"下加载
// ==========================================

(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('充值神的MD插件 需要在非沙盒（unsandboxed）模式下才能运行！');
    }

    class ChongzhishenMD {
        constructor() {
            // 保存所有已创建的窗口 { 名称: {container, header, content, ...} }
            this.windows = {};
        }

        getInfo() {
            return {
                id: 'chongzhishenmd',
                name: '充值神的Markdown插件',
                color1: '#5C6BC0',
                color2: '#3F51B5',
                blocks: [
                    {
                        opcode: 'about',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '关于本插件'
                    },
                    '---',
                    {
                        opcode: 'createWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '创建/更新MD窗口 [NAME] 内容为 [MD]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            MD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '# 你好\n这是**Markdown**内容\n- 列表1\n- 列表2'
                            }
                        }
                    },
                    {
                        opcode: 'closeWindow',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '关闭窗口 [NAME]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' }
                        }
                    },
                    '---',
                    {
                        opcode: 'setPosition',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 位置 x:[X] y:[Y]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'setSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 大小 宽:[W] 高:[H]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 400 },
                            H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 300 }
                        }
                    },
                    {
                        opcode: 'setBgColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 背景颜色为 [COLOR]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' }
                        }
                    },
                    {
                        opcode: 'setTextColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 文字颜色为 [COLOR]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' }
                        }
                    },
                    {
                        opcode: 'setOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 透明度为 [OPACITY] %',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            OPACITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: 'setFullscreen',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 全屏为 [STATE]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            STATE: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'setDraggable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 可拖动为 [STATE]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            STATE: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    {
                        opcode: 'setVisible',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 显示为 [STATE]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            STATE: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    '---',
                    {
                        opcode: 'setFontSize',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 字体大小为 [SIZE]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 }
                        }
                    },
                    {
                        opcode: 'setBorderRadius',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 圆角为 [RADIUS]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            RADIUS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 }
                        }
                    },
                    {
                        opcode: 'setBorder',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 边框宽度[WIDTH] 颜色[COLOR]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            WIDTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#cccccc' }
                        }
                    },
                    {
                        opcode: 'setZIndex',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 层级为 [Z]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 999999 }
                        }
                    },
                    {
                        opcode: 'setHeaderVisible',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置窗口 [NAME] 标题栏显示为 [STATE]',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' },
                            STATE: { type: Scratch.ArgumentType.BOOLEAN }
                        }
                    },
                    '---',
                    {
                        opcode: 'windowExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '窗口 [NAME] 是否存在?',
                        arguments: {
                            NAME: { type: Scratch.ArgumentType.STRING, defaultValue: '窗口1' }
                        }
                    },
                    {
                        opcode: 'getWindowList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '已创建的窗口列表'
                    }
                ],
                menus: {
                    windowMenu: {
                        acceptReporters: true,
                        items: 'getWindowMenuItems'
                    }
                }
            };
        }

        // ---------- 动态菜单 ----------
        getWindowMenuItems() {
            const names = Object.keys(this.windows);
            if (names.length === 0) return [{ text: '(暂无窗口)', value: '' }];
            return names.map((n) => ({ text: n, value: n }));
        }

        // ---------- 关于 ----------
        about() {
            return '充值神的MD插件 | 作者：充值神 | 用于在TurboWarp/CCW中渲染Markdown窗口';
        }

        // ---------- 极简 Markdown 转 HTML ----------
        renderMarkdown(md) {
            if (!md) return '';
            let text = String(md)
                .replace(/\\h/g, '\n')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // 代码块
            text = text.replace(/```([\s\S]*?)```/g, (m, code) => {
                return '<pre style="background:#f4f4f4;padding:8px;border-radius:4px;overflow:auto;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;"><code style="white-space:inherit;">' +
                    code.trim() + '</code></pre>';
            });

            // 标题
            text = text.replace(/^\s*######\s*(.*)$/gm, '<h6>$1</h6>\n\n');
            text = text.replace(/^\s*#####\s*(.*)$/gm, '<h5>$1</h5>\n\n');
            text = text.replace(/^\s*####\s*(.*)$/gm, '<h4>$1</h4>\n\n');
            text = text.replace(/^\s*###\s*(.*)$/gm, '<h3>$1</h3>\n\n');
            text = text.replace(/^\s*##\s*(.*)$/gm, '<h2>$1</h2>\n\n');
            text = text.replace(/^\s*#\s*(.*)$/gm, '<h1>$1</h1>\n\n');

            // 引用
            text = text.replace(/^&gt; (.*)$/gm, '<blockquote style="border-left:4px solid #ccc;margin:4px 0;padding-left:8px;color:#666;">$1</blockquote>');

            // 分割线
            text = text.replace(/^(-{3,}|\*{3,})$/gm, '<hr>');

            // 粗体/斜体/删除线/行内代码
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
            text = text.replace(/_(.*?)_/g, '<em>$1</em>');
            text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
            text = text.replace(/`(.*?)`/g, '<code style="background:#f4f4f4;padding:2px 4px;border-radius:3px;">$1</code>');

            // 图片 / 链接
            text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">');
            text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

            // 无序/有序列表
            text = text.replace(/^(\s*)[-*] (.*)$/gm, '<li>$2</li>');
            text = text.replace(/^(\s*)\d+\. (.*)$/gm, '<li>$2</li>');
            text = text.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => '<ul style="margin:4px 0;padding-left:20px;">' + m + '</ul>');

            // 段落
            text = text
                .split(/\n{2,}/)
                .map((block) => {
                    if (/^<(h\d|ul|ol|li|pre|blockquote|hr|img)/.test(block.trim())) {
                        return block;
                    }
                    return '<p style="margin:4px 0;">' + block.replace(/\n/g, '<br>') + '</p>';
                })
                .join('\n');

            return text;
        }

        // ---------- 创建/更新窗口 ----------
        createWindow(args) {
            const name = String(args.NAME);
            const md = String(args.MD);
            let win = this.windows[name];
            if (!win) {
                win = this._buildWindow(name);
                this.windows[name] = win;
            }
            win.content.innerHTML = this.renderMarkdown(md);
        }

        _buildWindow(name) {
            const container = document.createElement('div');
            container.id = 'chongzhishen-md-' + name;
            Object.assign(container.style, {
                position: 'fixed',
                top: '100px',
                left: '100px',
                width: '400px',
                height: '300px',
                backgroundColor: '#ffffff',
                color: '#000000',
                opacity: '1',
                borderRadius: '8px',
                border: '1px solid #cccccc',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: '999999',
                overflow: 'hidden',
                fontFamily: 'sans-serif',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            });

            const header = document.createElement('div');
            header.textContent = name;
            Object.assign(header.style, {
                padding: '6px 10px',
                background: '#5C6BC0',
                color: '#fff',
                cursor: 'default',
                userSelect: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: '0'
            });

            const closeBtn = document.createElement('span');
            closeBtn.textContent = '×';
            Object.assign(closeBtn.style, { cursor: 'pointer', marginLeft: '8px', fontSize: '16px' });
            closeBtn.addEventListener('click', () => this.closeWindow({ NAME: name }));
            header.appendChild(closeBtn);

            const content = document.createElement('div');
            Object.assign(content.style, {
                padding: '10px',
                overflow: 'auto',
                flex: '1',
                fontSize: '14px',
                lineHeight: '1.5',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                boxSizing: 'border-box'
            });

            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);

            return {
                container,
                header,
                content,
                draggable: false,
                fullscreen: false,
                prevStyle: null,
                dragHandler: null
            };
        }

        // ---------- 关闭窗口 ----------
        closeWindow(args) {
            const name = String(args.NAME);
            const win = this.windows[name];
            if (!win) return;
            if (win.dragHandler) {
                win.header.removeEventListener('mousedown', win.dragHandler.onMouseDown);
                document.removeEventListener('mousemove', win.dragHandler.onMouseMove);
                document.removeEventListener('mouseup', win.dragHandler.onMouseUp);
            }
            win.container.remove();
            delete this.windows[name];
        }

        // ---------- 位置 / 大小 ----------
        setPosition(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.left = Number(args.X) + 'px';
            win.container.style.top = Number(args.Y) + 'px';
        }

        setSize(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.width = Number(args.W) + 'px';
            win.container.style.height = Number(args.H) + 'px';
        }

        // ---------- 颜色 / 透明度 ----------
        setBgColor(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.backgroundColor = args.COLOR;
        }

        setTextColor(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.content.style.color = args.COLOR;
        }

        setOpacity(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            let v = Number(args.OPACITY);
            if (isNaN(v)) v = 100;
            v = Math.max(0, Math.min(100, v));
            win.container.style.opacity = String(v / 100);
        }

        // ---------- 全屏 ----------
        setFullscreen(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            const enable = Boolean(args.STATE);
            win.fullscreen = enable;
            if (enable) {
                win.prevStyle = {
                    top: win.container.style.top,
                    left: win.container.style.left,
                    width: win.container.style.width,
                    height: win.container.style.height,
                    borderRadius: win.container.style.borderRadius
                };
                Object.assign(win.container.style, {
                    top: '0px',
                    left: '0px',
                    width: '100vw',
                    height: '100vh',
                    borderRadius: '0px'
                });
            } else if (win.prevStyle) {
                Object.assign(win.container.style, win.prevStyle);
            }
        }

        // ---------- 拖动 ----------
        setDraggable(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            const enable = Boolean(args.STATE);
            win.draggable = enable;
            win.header.style.cursor = enable ? 'move' : 'default';

            if (enable && !win.dragHandler) {
                let dragging = false;
                let offsetX = 0;
                let offsetY = 0;
                const onMouseDown = (e) => {
                    dragging = true;
                    const rect = win.container.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    e.preventDefault();
                };
                const onMouseMove = (e) => {
                    if (!dragging) return;
                    win.container.style.left = e.clientX - offsetX + 'px';
                    win.container.style.top = e.clientY - offsetY + 'px';
                };
                const onMouseUp = () => {
                    dragging = false;
                };
                win.header.addEventListener('mousedown', onMouseDown);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                win.dragHandler = { onMouseDown, onMouseMove, onMouseUp };
            } else if (!enable && win.dragHandler) {
                win.header.removeEventListener('mousedown', win.dragHandler.onMouseDown);
                document.removeEventListener('mousemove', win.dragHandler.onMouseMove);
                document.removeEventListener('mouseup', win.dragHandler.onMouseUp);
                win.dragHandler = null;
            }
        }

        // ---------- 显示/隐藏 ----------
        setVisible(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.display = Boolean(args.STATE) ? 'flex' : 'none';
        }

        setHeaderVisible(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.header.style.display = Boolean(args.STATE) ? 'flex' : 'none';
        }

        // ---------- 其他个性化 ----------
        setFontSize(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.content.style.fontSize = Number(args.SIZE) + 'px';
        }

        setBorderRadius(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.borderRadius = Number(args.RADIUS) + 'px';
        }

        setBorder(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.border = Number(args.WIDTH) + 'px solid ' + args.COLOR;
        }

        setZIndex(args) {
            const win = this.windows[String(args.NAME)];
            if (!win) return;
            win.container.style.zIndex = String(Number(args.Z));
        }

        // ---------- 查询 ----------
        windowExists(args) {
            return Object.prototype.hasOwnProperty.call(this.windows, String(args.NAME));
        }

        getWindowList() {
            return Object.keys(this.windows).join(', ');
        }
    }

    Scratch.extensions.register(new ChongzhishenMD());
})(Scratch);
