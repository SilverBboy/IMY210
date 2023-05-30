<?xml version="1.0"?>
	<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
		<!--u17104361 Patterson Rainbird-Webb-->
		<xsl:output method="html" indent="yes"/>
		<xsl:template match="/">
			<html>
			<link href="src/style.css" rel="stylesheet" type="type/css"/>
				<body style="background-color: #353935; display: inline-flex; flex-wrap: wrap; flex-direction: column; align-items: center; padding-top: 3%;">
					<div style="background-color: #cddc39; width: 100vw; margin-top: -55px; margin-left: -8px; display: inline-flex: flex-direction: row; font-size: 20pt; height: 80px; margin-bottom: 20px;">
						<h2 style="margin-left: 720px; margin-top: 5px; font-size: 45pt; color: white;">&amp;</h2><h2 style="margin-left: 680px;  margin-top: -110px;">FA</h2><h2 style="margin-left: 760px;  margin-top: -80px;">Qs</h2>
					</div>
					<xsl:for-each select="faqs/module">
						<div id="module" style="margin-bottom: 15px; padding-bottom: 10px; background-color: #EDEDED; width: 50%; border-radius: 25px;">
						<div id="head" style="background-color: #cddc39; height: 60px; padding-left: 10px; padding-top: 0.1%; border-top-left-radius: 25px; border-top-right-radius: 25px;">
							<h3 style="color: white"><xsl:value-of select="@code"/></h3>
							<h4 style="margin-top: -20px; padding-bottom: 5px;"><xsl:value-of select="@name"/></h4>
						</div>
						<div id="body" style="padding-left: 15px; padding-right: 15px; padding-top: 5px;">
							<xsl:for-each select="faq">
								<div style="background-color: lightgrey; border-radius: 2px;">
									<div id="innerdiv" style="margin-left: 2px; background-color: #EDEDED;">
										<div id="q" style="border: none; border-radius: 2px;">
											<p style="color: #353935; padding-left: 5px;"><xsl:value-of select="question"/></p>
										</div>
										<div id="answer" style="background-color: #eef4be; border: none; margin-top: -15px; margin-bottom: 10px; border-radius: 2px;">
											<p style="padding-left: 15px;"><xsl:value-of select="answer"/></p>
										</div>
									</div>
								</div>
							</xsl:for-each>
						</div>
						</div>
					</xsl:for-each>
				</body>
			</html>
		</xsl:template>
	</xsl:stylesheet>