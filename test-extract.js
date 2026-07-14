const targetUrl = '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="https://embed.cx/admin/embed01/" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture" scrolling="no"></iframe></div>';
if (targetUrl.toLowerCase().includes('<iframe')) {
  const srcMatch = targetUrl.match(/src\s*=\s*["']([^"']+)["']/i);
  console.log(srcMatch ? srcMatch[1] : 'no src');
} else {
  console.log('no iframe');
}
