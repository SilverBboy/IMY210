<?xml version="1.0" encoding="UTF-8"?>
<!--u17104361 Patterson Rainbird-Webb-->
	<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:fox="http://xmlgraphics.achace.org/fop/extensions">
	<xsl:output method="xml" indent="yes"/>

	<xsl:template match="/">

		<fo:root>
			<fo:layout-master-set>
			<fo:simple-page-master master-name="mainPage">
				<fo:region-body background-color="#353935"/>
			</fo:simple-page-master>
			<fo:simple-page-master master-name="contentPage">
				<fo:region-body background-color="#353935"/>
			</fo:simple-page-master>
			</fo:layout-master-set>
		

		<fo:page-sequence master-reference="mainPage">
			<fo:flow flow-name="xsl-region-body">
				<fo:block-container id="index" background-color="#cddc39" margin-bottom="10px" margin-top="0px">
					<fo:block height="60px" font-size="32pt" color="white" margin-left="285px" margin-top="3px">
						&amp;
					</fo:block>
					<fo:block height="60px" font-size="22pt" margin-top="-30px" margin-left="258px">
						<xsl:text>FA</xsl:text>&#160; &#160;<xsl:text>Qs</xsl:text>
					</fo:block>
				</fo:block-container>
				<fo:block-container width="80%" background-color="#EDEDED" margin-left="80px" padding-left="-35px" padding-bottom="5px">
					<fo:block background-color="#CDDC39" font-size="18pt" padding-top="2px" padding-bottom="2px" padding-left="10px" margin-bottom="8px">
						<xsl:text>Index</xsl:text>
					</fo:block>
					<xsl:param name="module"/>
					<xsl:for-each select="faqs/module">
						<fo:block font-size="8pt" padding-top="5px" padding-left="40px" margin-left="-10px">
							<xsl:variable name="count" select="position()"></xsl:variable>
							<fo:basic-link internal-destination="{$count}" color="black">
								<xsl:value-of select="$count"/>
								<xsl:text>&#160; &#160; &#160; &#160; &#160; &#160;</xsl:text>
								<xsl:value-of select="@code"/>
							</fo:basic-link>
						</fo:block>
					</xsl:for-each>
				</fo:block-container>
			</fo:flow>
		</fo:page-sequence>
		<xsl:for-each select="faqs/module">
			<xsl:variable name="pos">
				<xsl:value-of select="position()"/>
			</xsl:variable>
		<fo:page-sequence master-reference="contentPage">
			<fo:flow flow-name="xsl-region-body">
				<fo:block-container id="{$pos}" margin-bottom="0px"  margin-top="25px" margin-left="100px" padding-bottom="5px" background-color="#CDDC39" width="70%">
					<fo:block color="black" margin-left="-90px" padding-top="5px" font-size="14pt">
						<xsl:value-of select="@code"/>
					</fo:block>
					<fo:block color="black" margin-left="-90px" padding-top="1px" font-size="10pt">
						<xsl:value-of select="@name"/>
					</fo:block>
				</fo:block-container>
				<fo:block-container background-color="#EDEDED" width="70%" margin-left="100px" margin-bottom="5px" padding-top="5px" padding-bottom="5px">
					<xsl:for-each select="faq">
						<fo:block-container margin-bottom="5px" width="90%" margin-left="20px" border-left="solid darkgrey 0.8pt" padding-left="-10px">
							<fo:block font-size="8pt" padding-top="2px" padding-bottom="2px" padding-left="11px">
								<xsl:value-of select="question"/>
							</fo:block>
							<fo:block font-size="8pt" background-color="#EEF4BE" width="60%" padding-left="12px" margin-left="-2px" padding-top="2px" padding-bottom="2px">
								<xsl:value-of select="answer"/>
							</fo:block>
						</fo:block-container>
					</xsl:for-each>
				</fo:block-container>
				<fo:block-container>
					<fo:block bottom="1" position="absolute">
						<fo:footnote>
							<fo:inline/>
								<fo:footnote-body>
									<fo:block background-color="#cddc39" padding-top="1px" padding-bottom="1px">
										<fo:basic-link internal-destination="index" color="black">&#160; &#160;To top</fo:basic-link>
										<xsl:text>&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</xsl:text>
										<xsl:value-of select="position()"/>
									</fo:block>
								</fo:footnote-body>
						</fo:footnote>
					</fo:block>
				</fo:block-container>
			</fo:flow>
		</fo:page-sequence>
		</xsl:for-each>

		</fo:root>
	</xsl:template>
	</xsl:stylesheet>